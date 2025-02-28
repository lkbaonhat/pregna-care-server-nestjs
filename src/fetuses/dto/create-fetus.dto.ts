import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { FetusGender } from '../types/gender.type';

export class CreateFetusDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  dueDate: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(FetusGender))
  gender: string;
}
