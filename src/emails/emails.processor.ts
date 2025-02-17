import { Process, Processor } from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bull';

import { Mail } from './types/mail';

@Processor('emails')
export class EmailsProcessor {
  constructor(private readonly mailService: MailerService) {}

  private async sendMail(job: Job<Mail>, config?: Partial<Mail>) {
    const { data } = job;
    try {
      await this.mailService.sendMail({
        ...data,
        ...config,
        context: data.data,
      });
    } catch (error) {
      console.error('Error sending email', error);
    }
  }

  @Process('verification')
  async sendVerification(job: Job<Mail>) {
    await this.sendMail(job, {
      subject: 'Please confirm your email',
      template: 'validation-email',
    });
  }

  @Process('reset-password')
  async sendResetPassword(job: Job<Mail>) {
    await this.sendMail(job, {
      subject: 'Reset your password',
      template: 'reset-password-email',
    });
  }
}
