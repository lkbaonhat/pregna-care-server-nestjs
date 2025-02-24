import { Processor, WorkerHost } from '@nestjs/bullmq';
import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { StripeCustomerDto } from './dtos/customer.dto';
import { stripeConfig } from 'src/config/stripe-config';
import { UserDocument } from 'src/users/user.schema';

export type StripeCustomerData = {
  user: UserDocument;
  stripeCustomer: StripeCustomerDto;
};

@Processor('stripe-customer', {
  concurrency: 2,
})
export class StripeCustomerProcessor extends WorkerHost {
  private readonly logger = new Logger(StripeCustomerProcessor.name);
  private stripe: Stripe;
  constructor(@Inject(ConfigService) private configService: ConfigService) {
    super();
    this.stripe = new Stripe(
      this.configService.getOrThrow('STRIPE_SECRET_KEY'),
      stripeConfig,
    );
  }
  async process(job: Job<StripeCustomerData>): Promise<void> {
    this.logger.log('Job:', job.name);
    switch (job.name) {
      case 'create':
        await this.createStripeCustomer(job);
        break;
      case 'update':
        await this.createStripeCustomer(job);
        break;
      case 'attach-payment-method':
        await this.attachPaymentMethodToCustomer(job);
        break;
      default:
        break;
    }
  }

  async createStripeCustomer(job: Job<StripeCustomerData>) {
    const {
      data: { user, stripeCustomer },
    } = job;
    const customer = await this.stripe.customers.create({
      email: user.email,
      ...stripeCustomer,
    });
    this.logger.log('Created stripe customer:', customer.email);

    user.stripeCustomerId = customer.id;
    await user.save();

    return customer;
  }

  async updateStripeCustomer(job: Job<StripeCustomerData>) {
    const {
      data: { user, stripeCustomer },
    } = job;

    if (!user.stripeCustomerId)
      throw new BadRequestException('User not registered in stripe');

    const customer = await this.stripe.customers.update(
      user.stripeCustomerId,
      stripeCustomer,
    );
    this.logger.log('Updated stripe customer:', customer.email);

    return customer;
  }

  async attachPaymentMethodToCustomer(job: Job<StripeCustomerData>) {
    const {
      data: {
        user,
        stripeCustomer: { paymentMethodId },
      },
    } = job;

    if (!paymentMethodId)
      throw new BadRequestException('Payment method not found');

    if (!user.stripeCustomerId)
      throw new BadRequestException('User not registered in stripe');

    const paymentMethod = await this.stripe.paymentMethods.attach(
      paymentMethodId,
      { customer: user.stripeCustomerId },
    );

    this.logger.log('Attached payment method:', paymentMethod.id);

    return paymentMethod;
  }
}
