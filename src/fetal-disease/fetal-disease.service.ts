import { Injectable } from '@nestjs/common';
import { CreateFetalDiseaseDto } from './dto/create-fetal-disease.dto';
import { FetalDisease, FetalDiseaseDocument } from './entities/fetal-disease.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FetalDiseaseService {

  constructor(
    @InjectModel(FetalDisease.name) private fetalDiseaseModel: Model<FetalDisease>
  ) { }

  create(createFetalDiseaseDto: CreateFetalDiseaseDto) {
    return 'This action adds a new fetalDisease';
  }
}
