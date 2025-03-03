import { Module } from '@nestjs/common';
import { FetalDiseaseService } from './fetal-disease.service';
import { FetalDiseaseController } from './fetal-disease.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FetalDisease,
  FetalDiseaseSchema,
} from './entities/fetal-disease.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FetalDisease.name, schema: FetalDiseaseSchema },
    ]),
  ],
  controllers: [FetalDiseaseController],
  providers: [FetalDiseaseService],
})
export class FetalDiseaseModule {}
