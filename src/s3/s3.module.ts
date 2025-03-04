import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule,
    MulterModule.registerAsync({
      useFactory: async () => ({
        storage: undefined, // We'll configure this in the controller instead
      }),
    }),
  ],
  providers: [S3Service],
  controllers: [S3Controller],
  exports: [S3Service]
})
export class S3Module { }
