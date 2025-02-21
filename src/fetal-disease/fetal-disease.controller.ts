import { Controller, Get, Post, Body, NotFoundException, Query } from '@nestjs/common';
import { FetalDiseaseService } from './fetal-disease.service';
import { CreateFetalDiseaseDto } from './dto/create-fetal-disease.dto';


@Controller('admin/fetal-disease')
export class FetalDiseaseController {
  constructor(private readonly fetalDiseaseService: FetalDiseaseService) { }

  @Post('create')
  create(@Body() createFetalDiseaseDto: CreateFetalDiseaseDto) {
    return this.fetalDiseaseService.create(createFetalDiseaseDto);
  }

  @Get('find-all')
  async findAll() {
    return await this.fetalDiseaseService.findAll();
  }

  @Get('find-by-week')
  async findFetalDiseasesByWeek(@Query('week') week: number, @Query('isDeleted') isDeleted: boolean) {
    return await this.fetalDiseaseService.findFetalDiseasesByWeek(+week, isDeleted);
  }
}
