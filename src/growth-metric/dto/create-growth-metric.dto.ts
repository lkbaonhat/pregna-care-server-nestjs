import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class GrowthMetricData {
  @IsString()
  name: string;

  @IsString()
  unit: string;

  @IsNumber()
  value: number;
}

export class CreateGrowthMetricDto {
  @IsNumber()
  week: number;

  @ValidateNested({ each: true })
  data: GrowthMetricData[];
}
