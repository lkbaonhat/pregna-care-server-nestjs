import { PartialType } from '@nestjs/swagger';
import { CreateFetalDiseaseDto } from './create-fetal-disease.dto';

export class UpdateFetalDiseaseDto extends PartialType(CreateFetalDiseaseDto) {}
