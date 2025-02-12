import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { Mail } from './types/mail';

@Injectable()
export class EmailsService {
  constructor(@InjectQueue('emails') private readonly emailQueue: Queue) {}

  async sendVerificationEmail(data: Mail) {
    const job = await this.emailQueue.add('verification', data);
    return job.id;
  }
}
