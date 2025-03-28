import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
  Min,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { MembershipPlanTypes } from '../types/membership-plan';

export class CreateMembershipPlanDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description: string;

  @IsEnum(MembershipPlanTypes)
  type: string;

  @IsBoolean()
  isActive: boolean;

  @IsArray()
  @IsString({ each: true })
  benefits: string[];
}
