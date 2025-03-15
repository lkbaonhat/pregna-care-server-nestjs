import { Module } from '@nestjs/common';
import { FetusStandardService } from './fetus-standard.service';
import { FetusStandardController } from './fetus-standard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FetusStandard,
  FetusStandardSchema,
} from './entities/fetus-standard.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FetusStandard.name, schema: FetusStandardSchema },
    ]),
  ],
  controllers: [FetusStandardController],
  providers: [FetusStandardService],
  exports: [
    MongooseModule.forFeature([{ name: FetusStandard.name, schema: FetusStandardSchema }]),
    FetusStandardService,
  ],
})
export class FetusStandardModule { }
