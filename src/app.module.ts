import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StripeModule } from './stripe/stripe.module';
import { MembershipPlanModule } from './membership-plan/membership-plan.module';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { PaymentsModule } from './payments/payments.module';
import { FetusStandardModule } from './fetus-standard/fetus-standard.module';
import { FetalDiseaseModule } from './fetal-disease/fetal-disease.module';
import { FetusesModule } from './fetuses/fetuses.module';
import { GrowthMetricModule } from './growth-metric/growth-metric.module';
import { CreateBlogPostModule } from './blog-post/blog-post.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 200,
      },
    ]),
    UsersModule,
    AuthModule,
    MembershipPlanModule,
    PaymentsModule,
    StripeModule,
    FetusStandardModule,
    FetalDiseaseModule,
    FetusesModule,
    GrowthMetricModule,
    CreateBlogPostModule,
    S3Module
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule { }
