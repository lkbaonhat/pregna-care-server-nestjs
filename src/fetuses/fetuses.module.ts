import { Module } from '@nestjs/common';
import { FetusesService } from './fetuses.service';
import { FetusesController } from './fetuses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Fetus, FetusSchema } from './entities/fetus.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fetus.name, schema: FetusSchema }]),
  ],
  controllers: [FetusesController],
  providers: [FetusesService],
})
export class FetusesModule { }
