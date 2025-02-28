import { Module } from '@nestjs/common';
import { GrowthMetricService } from './growth-metric.service';
import { GrowthMetricController } from './growth-metric.controller';
import {
  GrowthMetric,
  GrowthMetricSchema,
} from './entities/growth-metric.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { FetusesModule } from 'src/fetuses/fetuses.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GrowthMetric.name, schema: GrowthMetricSchema },
    ]),
    FetusesModule,
  ],
  controllers: [GrowthMetricController],
  providers: [GrowthMetricService],
})
export class GrowthMetricModule {}
