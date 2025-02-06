import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EmailsService } from './emails.service';

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
      }),
    }),
  ],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
