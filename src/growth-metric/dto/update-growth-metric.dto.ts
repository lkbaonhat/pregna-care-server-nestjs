import { PartialType } from '@nestjs/swagger';
import { CreateGrowthMetricDto } from './create-growth-metric.dto';

export class UpdateGrowthMetricDto extends PartialType(CreateGrowthMetricDto) {}
