import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EmailsService } from './emails.service';
import { EmailsProcessor } from './emails.processor';
import { getFullTemplatePath } from 'src/utils/mails';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SES_AWS_SMTP_ENDPOINT'),
          port: configService.get<number>('SES_AWS_SMTP_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('SES_AWS_SMTP_USERNAME'),
            pass: configService.get<string>('SES_AWS_SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: configService.get<string>('SES_AWS_SMTP_SENDER'),
        },
        template: {
          dir: getFullTemplatePath(),
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'emails',
    }),
  ],
  providers: [EmailsService, EmailsProcessor],
  exports: [EmailsService],
})
export class EmailsModule {}
