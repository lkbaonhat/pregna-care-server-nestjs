import { FetusesService } from './../fetuses/fetuses.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGrowthMetricDto } from './dto/create-growth-metric.dto';
import { UpdateGrowthMetricDto } from './dto/update-growth-metric.dto';
import { Fetus, FetusDocument } from 'src/fetuses/entities/fetus.entity';
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
  ) { }

  async createByMember(
    fetusId: string,
    createGrowthMetricDto: CreateGrowthMetricDto[],
  ) {
    // Tìm Fetus dựa trên ID
    const fetus = await this.fetusModel.findById(fetusId);
    if (!fetus) {
      throw new NotFoundException('Fetus not found');
    }
    // Tạo danh sách GrowthMetric mới
    const createdGrowthMetrics = await this.growthMetricModel.insertMany(
      createGrowthMetricDto.map((metric) => ({
        ...metric,
        fetusId,
      })),
    );

    // Thêm danh sách GrowthMetric vào metrics của Fetus
    fetus.metrics.push(...createdGrowthMetrics.map((metric) => metric._id));
    await fetus.save();

    return createdGrowthMetrics;
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
