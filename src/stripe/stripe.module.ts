import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { StripeService } from './stripe.service';
import { StripeCustomerProcessor } from './stripe-customer.processor';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'stripe-customer', prefix: 'pregnacare' }),
    PaymentsModule,
  ],
  providers: [StripeService, StripeCustomerProcessor],
  exports: [StripeService],
})
export class StripeModule {}
