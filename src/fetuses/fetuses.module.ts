import { Module } from '@nestjs/common';
import { FetusesService } from './fetuses.service';
import { FetusesController } from './fetuses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Fetus, FetusSchema } from './entities/fetus.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fetus.name, schema: FetusSchema }]),
    UsersModule,
  ],
  controllers: [FetusesController],
  providers: [FetusesService],
  exports: [
    MongooseModule.forFeature([{ name: Fetus.name, schema: FetusSchema }]),
    FetusesService,
  ],
})
export class FetusesModule { }
