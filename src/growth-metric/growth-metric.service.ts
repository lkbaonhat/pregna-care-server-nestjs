import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGrowthMetricDto } from './dto/create-growth-metric.dto';
import { UpdateGrowthMetricDto } from './dto/update-growth-metric.dto';
import { FetusDocument } from 'src/fetuses/entities/fetus.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GrowthMetricDocument } from './entities/growth-metric.entity';
import { FetusStandardService } from 'src/fetus-standard/fetus-standard.service';

@Injectable()
export class GrowthMetricService {
  constructor(
    @InjectModel('GrowthMetric')
    private growthMetricModel: Model<GrowthMetricDocument>,
    @InjectModel('Fetus')
    private fetusModel: Model<FetusDocument>,
    private fetusStandardService: FetusStandardService,
  ) { }

  async createByMember(
    fetusId: string,
    createGrowthMetricDto: CreateGrowthMetricDto,
  ) {
    // Tìm Fetus dựa trên ID
    const fetus = await this.fetusModel.findById(fetusId);
    if (!fetus) {
      throw new NotFoundException('Fetus not found');
    }
    const existedGrowthMetrics = await this.growthMetricModel.findOne({
      fetusId,
    });

    let growthMetrics: GrowthMetricDocument;
    // If not existed growth metric, create new one
    if (!existedGrowthMetrics) {
      growthMetrics = new this.growthMetricModel({
        fetusId,
        data: [createGrowthMetricDto],
      });
      await growthMetrics.save();
      await this.fetusModel.findByIdAndUpdate(fetusId, {
        metrics: growthMetrics._id,
      });
    } else {
      growthMetrics = existedGrowthMetrics;

      const existedGrowthMetricWeekIndex = growthMetrics.data.findIndex(
        (metric) => metric.week === createGrowthMetricDto.week,
      );
      // Check if not existed week, create new week. Otherwise, update existed week
      if (existedGrowthMetricWeekIndex === -1)
        growthMetrics.data.push(createGrowthMetricDto);
      else {
        growthMetrics.data[existedGrowthMetricWeekIndex].data =
          createGrowthMetricDto.data;
      }
      await growthMetrics.save();
    }

    return growthMetrics;
  }

  async findAllGrowthsByFetusId(fetusId: string) {
    const fetus = await this.fetusModel.findById(fetusId);
    if (!fetus) {
      throw new NotFoundException('Fetus not found');
    }
    const growthMetrics = await this.growthMetricModel.findOne({ fetusId });
    if (!growthMetrics) {
      throw new NotFoundException('Growth metrics not found');
    }

    return growthMetrics
  }

  async chartRadarGrowthMetrics(fetusId: string, week: number) {
    const fetus = await this.fetusModel.findById(fetusId);
    if (!fetus) {
      throw new NotFoundException('Fetus not found');
    }

    const growthMetrics = await this.growthMetricModel.findOne({ fetusId });
    if (!growthMetrics) {
      throw new NotFoundException('Growth metrics not found');
    }
    console.log("growthMetrics", growthMetrics);
    const growthMetric = growthMetrics.data.find((metric) => metric.week === week);
    console.log("growthMetric", growthMetric);
    if (!growthMetric) {
      throw new NotFoundException(`Growth metric not found for week ${week}`);
    }

    // Fetch standard data for the specific week
    // Make sure this method exists in your FetusStandardService
    const standardData = await this.fetusStandardService.findFetusStandardByWeek(week);
    if (!standardData) {
      throw new NotFoundException(`Standard data not found for week ${week}`);
    }
    console.log("standardData", standardData);

    // Create a combined data array that includes current values
    const combinedData = [...standardData];

    // Add current values for each metric type present in growthMetric.data
    if (growthMetric.data && growthMetric.data.length > 0) {
      growthMetric.data.forEach(item => {
        // Find if this item type already exists in standard data
        if (standardData.some(std => std.item === item.type)) {
          combinedData.push({
            item: item.type,
            value: "current",
            score: item.value
          });
        }
      });
    }

    return {
      data: combinedData
    };
  }

  findAll() {
    return `This action returns all growthMetric`;
  }

  findOne(id: number) {
    return `This action returns a #${id} growthMetric`;
  }

  update(id: number, updateGrowthMetricDto: UpdateGrowthMetricDto) {
    return `This action updates a #${id} growthMetric`;
  }

  remove(id: number) {
    return `This action removes a #${id} growthMetric`;
  }
}
