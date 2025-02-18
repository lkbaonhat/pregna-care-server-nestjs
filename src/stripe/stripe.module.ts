import { Module } from '@nestjs/common';

import { PaymentsModule } from 'src/payments/payments.module';
import { UsersModule } from 'src/users/users.module';

import { StripeController } from './stripe.controller';

import { StripeService } from './stripe.service';
import { AuthStripeService } from './auth-stripe.service';

@Module({
  imports: [PaymentsModule, UsersModule],
  providers: [StripeService, AuthStripeService],
  exports: [StripeService],
  controllers: [StripeController],
})
export class StripeModule {}
