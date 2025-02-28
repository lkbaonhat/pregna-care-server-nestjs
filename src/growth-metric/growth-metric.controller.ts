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
import { ParseMongoIdPipe } from 'src/pipes/parse-mongo-id.pipe';

@Controller('growth-metric')
export class GrowthMetricController {
  constructor(private readonly growthMetricService: GrowthMetricService) {}

  @Post('/create/:fetusId')
  async createByMember(
    @Param('fetusId', ParseMongoIdPipe) fetusId: string,
    @Body() createGrowthMetricDto: CreateGrowthMetricDto,
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

  @Patch('/update/:fetusId')
  async updateByMember(
    @Param('fetusId', ParseMongoIdPipe) fetusId: string,
    @Body() createGrowthMetricDto: UpdateGrowthMetricDto[],
  ): Promise<Response> {
    const updatedGrowthMetric = await this.growthMetricService.updateByMember(
      fetusId,
      createGrowthMetricDto,
    );

    return {
      message: 'GrowthMetric updated successfully',
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
