import { Processor, WorkerHost } from '@nestjs/bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { Mail } from './types/mail';

@Processor('emails', {
  concurrency: 2,
})
export class EmailsProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailsProcessor.name);
  constructor(private readonly mailService: MailerService) {
    super();
  }
  async process(job: Job<Mail>): Promise<void> {
    switch (job.name) {
      case 'verification':
        await this.sendVerification(job);
        break;
      case 'reset-password':
        await this.sendResetPassword(job);
        break;
      case 'payment-success':
        await this.sendPaymentSuccess(job);
        break;
      default:
        break;
    }
  }

  private async sendMail(job: Job<Mail>, config?: Partial<Mail>) {
    this.logger.log('Job:', job.name);
    const { data } = job;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const mailInfo = await this.mailService.sendMail({
        ...data,
        ...config,
        context: data.data,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.log(`Email sent: ${mailInfo?.messageId}`);
    } catch (error) {
      console.error('Error sending email', error);
    }
  }

  async sendVerification(job: Job<Mail>) {
    await this.sendMail(job, {
      subject: 'Please confirm your email',
      template: 'validation-email',
    });
  }

  async sendResetPassword(job: Job<Mail>) {
    await this.sendMail(job, {
      subject: 'Reset your password',
      template: 'reset-password-email',
    });
  }

  async sendPaymentSuccess(job: Job<Mail>) {
    await this.sendMail(job, {
      subject: 'Payment successful',
      template: 'payment-success-email',
    });
  }
}
