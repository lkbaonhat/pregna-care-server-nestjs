import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFetalDiseaseDto } from './dto/create-fetal-disease.dto';
import { FetalDisease } from './entities/fetal-disease.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FetalDiseaseService {
  constructor(
    @InjectModel(FetalDisease.name)
    private fetalDiseaseModel: Model<FetalDisease>,
  ) {}

  //#region find one fetal disease by name
  async findOneFetalDiseaseByName(name: string) {
    const result = await this.fetalDiseaseModel.findOne({
      name: name,
    });
    return result ? result : null;
  }
  //#endregion

  //#region find one fetal disease by name true false
  async isFetalDiseaseExist(name: string) {
    const fetalDisease = await this.findOneFetalDiseaseByName(name);
    return fetalDisease ? true : false;
  }
  //#endregion

  //#region find all
  async findAll() {
    return await this.fetalDiseaseModel.find();
  }
  //#endregion

  //#region find fetal diseases by week
  async findFetalDiseasesByWeek(week: number, isDeleted: boolean = false) {
    try {
      const diseases = await this.fetalDiseaseModel.find({
        affectedWeeks: { $in: [week], $nin: [isDeleted] },
      });
      if (!diseases || diseases.length === 0) {
        throw new NotFoundException(`No fetal diseases found for week ${week}`);
      }

      return {
        data: diseases,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error('Error fetching fetal diseases by week');
    }
  }
  //#endregion

  //#region create
  async create(createFetalDiseaseDto: CreateFetalDiseaseDto) {
    try {
      const isFetalDisease = await this.isFetalDiseaseExist(
        createFetalDiseaseDto.name,
      );
      if (isFetalDisease) {
        throw new ConflictException('Fetal Disease already exists');
      }

      const fetalDisease = new this.fetalDiseaseModel(createFetalDiseaseDto);
      fetalDisease.save();
      return {
        data: fetalDisease,
        message: 'Fetal Disease created successfully',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Internal Server Error');
    }
  }
  //#endregion
}
