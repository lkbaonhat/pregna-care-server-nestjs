import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { Mail } from './types/mail';

@Injectable()
export class EmailsService {
  constructor(@InjectQueue('emails') private readonly emailQueue: Queue) {}

  async sendVerificationEmail(data: Mail) {
    const job = await this.emailQueue.add('verification', data);
    return job.id;
  }

  async sendResetPasswordEmail(data: Mail) {
    const job = await this.emailQueue.add('reset-password', data);
    return job.id;
  }

  async sendPaymentSuccessEmail(data: Mail) {
    const job = await this.emailQueue.add('payment-success', data);
    return job.id;
  }
}
