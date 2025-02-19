import { Processor } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

@Processor('stripe')
export class StripeProcessor {
  private readonly logger = new Logger(StripeProcessor.name);
  constructor() {}
}
