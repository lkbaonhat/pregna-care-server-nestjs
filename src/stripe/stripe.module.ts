import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { StripeService } from './stripe.service';
import { StripeCustomerProcessor } from './stripe-customer.processor';
import { PaymentsModule } from 'src/payments/payments.module';
import { StripeController } from './stripe.controller';
import { EmailsModule } from 'src/emails/emails.module';
import { MembershipPlanModule } from 'src/membership-plan/membership-plan.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'stripe-customer', prefix: 'pregnacare' }),
    PaymentsModule,
    EmailsModule,
    MembershipPlanModule,
    UsersModule,
  ],
  providers: [StripeService, StripeCustomerProcessor],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
