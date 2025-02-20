import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

import { UserDocument } from 'src/users/user.schema';
import { stripeConfig } from 'src/config/stripe-config';
import { StripeCustomerDto } from './dtos/customer.dto';
import { StripeCustomerData } from './stripe-customer.processor';
import { PaymentsService } from 'src/payments/payments.service';
import { PaymentIntentRequestDto } from './dtos/payment-intent-request.dto';
import { ConfirmPaymentIntentRequestDto } from './dtos/confirm-payment-intent-request.dto';
import { AttachPaymentMethodDto } from './dtos/attach-payment-method-dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    @InjectQueue('stripe-customer') private readonly customerStripeQueue: Queue,
    private paymentsService: PaymentsService,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow('STRIPE_SECRET_KEY'),
      stripeConfig,
    );
  }

  async createStripeCustomer(
    user: UserDocument,
    stripeCustomer: StripeCustomerDto,
  ) {
    const job = await this.customerStripeQueue.add('create', {
      user,
      stripeCustomer,
    } as StripeCustomerData);
    return job.id;
  }

  async updateStripeCustomer(
    user: UserDocument,
    stripeCustomer: Exclude<StripeCustomerDto, 'email'>,
  ) {
    const job = await this.customerStripeQueue.add('update', {
      user,
      stripeCustomer,
    } as StripeCustomerData);
    return job.id;
  }

  async attachPaymentMethodToCustomer(
    user: UserDocument,
    data: AttachPaymentMethodDto,
  ) {
    if (!user.stripeCustomerId)
      throw new BadRequestException('User not registered in stripe');

    const { paymentMethodId } = data;

    const paymentMethod = await this.stripe.paymentMethods.attach(
      paymentMethodId,
      { customer: user.stripeCustomerId },
    );

    return paymentMethod;
  }

  async retrivePaymentMethodList(user: UserDocument) {
    if (!user.stripeCustomerId)
      throw new BadRequestException('User not registered in stripe');

    const paymentMethods = await this.stripe.customers.listPaymentMethods(
      user.stripeCustomerId,
      {
        type: 'card',
      },
    );

    return paymentMethods;
  }

  async createPaymentIntent(user: UserDocument, data: PaymentIntentRequestDto) {
    if (!user.stripeCustomerId)
      throw new BadRequestException('User not registered in stripe');

    const actualAmount = data.amount * 100;

    const paymentIntent = await this.stripe.paymentIntents.create({
      ...data,
      amount: actualAmount,
      customer: user.stripeCustomerId,
      confirmation_method: 'manual',
    });

    await this.paymentsService.create({
      userId: user._id,
      stripeId: paymentIntent.id,
      stripeObject: paymentIntent.object,
      amount: actualAmount,
      currency: paymentIntent.currency,
      paymentMethodTypes: paymentIntent.payment_method_types,
      status: paymentIntent.status,
    });

    return paymentIntent;
  }

  async confirmPaymentIntent({
    paymentIntentId,
    paymentMethodId,
  }: ConfirmPaymentIntentRequestDto) {
    const payment =
      await this.paymentsService.findByPaymentIntentId(paymentIntentId);
    if (!payment) throw new BadRequestException('Payment not found');

    const result = await this.stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
      return_url: `${this.configService.getOrThrow<string>('EMAIL_CONFIRMATION_URL')}/payments/success`,
    });

    payment.status = result.status;

    return result;
  }

  // public async createCheckoutSession(
  //   clientReferencedId: string,
  //   parameters: CheckoutSessionRequestDto,
  // ): Promise<CheckoutSessionResponseDto> {
  //   const stripeRedirectsBaseUrl = this.configService.getOrThrow<string>(
  //     'STRIPE_REDIRECT_BASE_URL',
  //   );

  //   const mappedSessionParameters: Stripe.Checkout.SessionCreateParams = {
  //     mode: parameters.mode as Stripe.Checkout.SessionCreateParams.Mode,
  //     client_reference_id: clientReferencedId,
  //     line_items: parameters.lineItems,
  //     success_url: `${stripeRedirectsBaseUrl}${parameters.successFrontendPath}`,
  //     cancel_url: parameters.cancelFrontendPath
  //       ? `${stripeRedirectsBaseUrl}${parameters.cancelFrontendPath}`
  //       : undefined,
  //   };

  //   const session = await this.stripe.checkout.sessions.create(
  //     mappedSessionParameters,
  //   );

  //   if (!session.url) {
  //     this.logger.error('Failed to create stripe checkout session', {
  //       mappedSessionParameters,
  //     });
  //     throw new Error('Failed to create checkout session');
  //   }

  //   return { stripeSessionUrl: session.url, stripeSessionId: session.id };
  // }
}
