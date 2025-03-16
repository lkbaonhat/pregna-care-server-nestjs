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
  ) {}

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

    const growthMetricWeeks = growthMetrics.data.map((metric) => metric.week);
    const newGrowthMetrics: {
      week: number;
      data: {
        name: string;
        unit: string;
        value: number;
        min: number;
        max: number;
      }[];
    }[] = [];
    for (const week of growthMetricWeeks) {
      const newStandard =
        await this.fetusStandardService.findByWeekForMember(week);
      const value = growthMetrics.data.find((metric) => metric.week === week);
      if (!value) {
        throw new NotFoundException('Value not found');
      }
      const result = newStandard.map((standard) => {
        const valueData = value.data.find(
          (data) => data.name === standard.name,
        );
        if (!valueData) {
          throw new NotFoundException('Value data not found');
        }
        return {
          ...standard,
          value: valueData.value,
        };
      });
      newGrowthMetrics.push({
        week: week,
        data: result,
      });
    }

    return newGrowthMetrics;
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
