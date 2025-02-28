import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGrowthMetricDto } from './dto/create-growth-metric.dto';
import { UpdateGrowthMetricDto } from './dto/update-growth-metric.dto';
import { FetusDocument } from 'src/fetuses/entities/fetus.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GrowthMetricDocument } from './entities/growth-metric.entity';

@Injectable()
export class GrowthMetricService {
  constructor(
    @InjectModel('GrowthMetric')
    private growthMetricModel: Model<GrowthMetricDocument>,
    @InjectModel('Fetus')
    private fetusModel: Model<FetusDocument>,
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
      fetus.metrics = growthMetrics._id;
      await fetus.save();
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
