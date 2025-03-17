import { Module } from '@nestjs/common';
import { GrowthMetricService } from './growth-metric.service';
import { GrowthMetricController } from './growth-metric.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FetusesModule } from 'src/fetuses/fetuses.module';
import { FetusStandardModule } from 'src/fetus-standard/fetus-standard.module';
import { GrowthMetricSchema } from './entities/growth-metric.entity';
import { FetusSchema } from 'src/fetuses/entities/fetus.entity';
import {
  FetusStandard,
  FetusStandardSchema,
} from 'src/fetus-standard/entities/fetus-standard.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GrowthMetric', schema: GrowthMetricSchema },
      { name: 'Fetus', schema: FetusSchema },
      { name: FetusStandard.name, schema: FetusStandardSchema },
    ]),
    FetusesModule,
    FetusStandardModule,
  ],
  controllers: [GrowthMetricController],
  providers: [GrowthMetricService],
})
export class GrowthMetricModule {}
