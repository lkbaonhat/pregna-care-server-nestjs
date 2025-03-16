import { Module } from '@nestjs/common';
import { GrowthMetricService } from './growth-metric.service';
import { GrowthMetricController } from './growth-metric.controller';
import {
  GrowthMetric,
  GrowthMetricSchema,
} from './entities/growth-metric.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { FetusesModule } from 'src/fetuses/fetuses.module';
import { FetusStandardModule } from 'src/fetus-standard/fetus-standard.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GrowthMetric.name, schema: GrowthMetricSchema },
    ]),
    FetusesModule,
    FetusStandardModule,
  ],
  controllers: [GrowthMetricController],
  providers: [GrowthMetricService],
})
export class GrowthMetricModule {}
