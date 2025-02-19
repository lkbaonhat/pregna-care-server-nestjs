import { Controller, Get, Post, Body } from '@nestjs/common';
import { FetalDiseaseService } from './fetal-disease.service';
import { CreateFetalDiseaseDto } from './dto/create-fetal-disease.dto';


@Controller('fetal-disease')
export class FetalDiseaseController {
  constructor(private readonly fetalDiseaseService: FetalDiseaseService) { }

  @Post()
  create(@Body() createFetalDiseaseDto: CreateFetalDiseaseDto) {
    return this.fetalDiseaseService.create(createFetalDiseaseDto);
  }

}
