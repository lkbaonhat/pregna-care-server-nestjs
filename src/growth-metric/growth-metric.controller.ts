import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GrowthMetricService } from './growth-metric.service';
import { CreateGrowthMetricDto } from './dto/create-growth-metric.dto';
import { UpdateGrowthMetricDto } from './dto/update-growth-metric.dto';
import { Response } from 'src/types/core';

@Controller('growth-metric')
export class GrowthMetricController {
  constructor(private readonly growthMetricService: GrowthMetricService) { }

  @Post('/create/:fetusId')
  async createByMember(
    @Param('fetusId') fetusId: string,
    @Body() createGrowthMetricDto: CreateGrowthMetricDto[],
  ): Promise<Response> {
    const createdGrowthMetric = await this.growthMetricService.createByMember(
      fetusId,
      createGrowthMetricDto,
    );

    return {
      message: 'GrowthMetric created successfully',
      data: createdGrowthMetric,
    };
  }

  @Get()
  findAll() {
    return this.growthMetricService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.growthMetricService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGrowthMetricDto: UpdateGrowthMetricDto,
  ) {
    return this.growthMetricService.update(+id, updateGrowthMetricDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.growthMetricService.remove(+id);
  }
}
