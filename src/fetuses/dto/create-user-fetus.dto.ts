import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FetusGender } from '../types/gender.type';

export class CreateUserFetusDto {
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
