import { IsNumber, IsString } from 'class-validator';

export class CreateGrowthMetricDto {
  @IsString()
  name: string;

  @IsString()
  unit: string;

  @IsNumber()
  value: number;

  @IsNumber()
  week: number;
}
