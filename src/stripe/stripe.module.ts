import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { StripeService } from './stripe.service';
import { StripeCustomerProcessor } from './stripe-customer.processor';
import { PaymentsModule } from 'src/payments/payments.module';
import { StripeController } from './stripe.controller';
import { EmailsModule } from 'src/emails/emails.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'stripe-customer', prefix: 'pregnacare' }),
    PaymentsModule,
    EmailsModule,
  ],
  providers: [StripeService, StripeCustomerProcessor],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
