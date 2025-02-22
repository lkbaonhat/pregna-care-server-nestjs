import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns';

import { User, UserDocument } from 'src/users/user.schema';
import { stripeConfig } from 'src/config/stripe-config';
import { StripeCustomerDto } from './dtos/customer.dto';
import { StripeCustomerData } from './stripe-customer.processor';
import { PaymentsService } from 'src/payments/payments.service';
import { PaymentIntentRequestDto } from './dtos/payment-intent-request.dto';
import { ConfirmPaymentIntentRequestDto } from './dtos/confirm-payment-intent-request.dto';
import { AttachPaymentMethodDto } from './dtos/attach-payment-method.dto';
import { EmailsService } from 'src/emails/emails.service';
import { MembershipPlanRequestDto } from './dtos/membership-plan-request.dto';
import { MembershipPlanService } from 'src/membership-plan/membership-plan.service';
import { isMembershipExpired } from 'src/utils/helper';
import { ConfirmMembershipPlanRequestDto } from './dtos/confirm-membership-plan-request.dto';
import { MembershipPlanTypes } from 'src/membership-plan/types/membership-plan';
import { formatDateFromSeconds } from 'src/utils/date';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    @InjectQueue('stripe-customer') private readonly customerStripeQueue: Queue,
    private paymentsService: PaymentsService,
    private emailsService: EmailsService,
    private membershipPlanService: MembershipPlanService,
    private usersService: UsersService,
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

    const return_url = `${this.configService.getOrThrow<string>('EMAIL_CONFIRMATION_URL')}/payments/${payment._id.toString()}/result`;

    const result = await this.stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
      return_url,
    });

    payment.status = result.status;
    await payment.save();

    const paymentPopulated = await payment.populate<{ userId: User }>('userId');
    const email = paymentPopulated.userId.email;

    // Convert date from number to string
    const date = format(new Date(result.created * 1000), 'MM/dd/yyyy HH:mm:ss');

    if (result.status === 'succeeded')
      await this.emailsService.sendPaymentSuccessEmail({
        to: email,
        data: {
          email: email,
          amount: result.amount,
          currency: result.currency.toUpperCase(),
          transactionId: result.id,
          paymentDate: date,
        },
      });

    return result;
  }

  async createMembershipPlanPaymentIntent(
    user: UserDocument,
    { plan, paymentMethod }: MembershipPlanRequestDto,
  ) {
    if (!user.stripeCustomerId)
      throw new BadRequestException('User not registered in stripe');

    const requestedMembershipPlan =
      await this.membershipPlanService.findOne(plan);

    if (!requestedMembershipPlan)
      throw new BadRequestException('Membership plan not found');
    if (!requestedMembershipPlan.isActive)
      throw new BadRequestException('Membership plan is not active');

    // check if user already still in membership
    if (requestedMembershipPlan.type === user.membership.plan)
      throw new BadRequestException('User already in this membership plan');
    // check if user valid to upgrade membership
    if (
      user.membership.plan === MembershipPlanTypes.Lifetime ||
      (user.membership.plan === MembershipPlanTypes.OneMonth &&
        isMembershipExpired(user.membership.dueDate)) ||
      (user.membership.plan === MembershipPlanTypes.Freemium &&
        isMembershipExpired(user.membership.dueDate))
    )
      throw new BadRequestException('User still in membership');

    // If requested membership plan is freemium, then create setup intent for future payment
    if (requestedMembershipPlan.type === MembershipPlanTypes.Freemium) {
      const setupIntent = await this.stripe.setupIntents.create({
        customer: user.stripeCustomerId,
        payment_method: paymentMethod,
      });

      await this.paymentsService.create({
        userId: user._id,
        stripeId: setupIntent.id,
        stripeObject: setupIntent.object,
        amount: 0,
        paymentMethodTypes: setupIntent.payment_method_types,
        status: setupIntent.status,
      });
    }

    const amount = requestedMembershipPlan.price * 100;
    const description = `Membership plan ${requestedMembershipPlan.name}`;

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: user.stripeCustomerId,
      payment_method: paymentMethod,
      confirmation_method: 'manual',
      description,
    });

    await this.paymentsService.create({
      userId: user._id,
      stripeId: paymentIntent.id,
      stripeObject: paymentIntent.object,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      paymentMethodTypes: paymentIntent.payment_method_types,
      status: paymentIntent.status,
    });

    return paymentIntent;
  }

  async confirmMembershipPlanPaymentIntent(
    user: UserDocument,
    { paymentIntentId, paymentMethodId, plan }: ConfirmMembershipPlanRequestDto,
  ) {
    const payment =
      await this.paymentsService.findByPaymentIntentId(paymentIntentId);
    if (!payment) throw new BadRequestException('Payment not found');

    const updatedMembershipPlan =
      await this.membershipPlanService.findOne(plan);
    if (!updatedMembershipPlan)
      throw new BadRequestException('Membership plan not found');

    const return_url = `${this.configService.getOrThrow<string>('EMAIL_CONFIRMATION_URL')}/payments/${payment._id.toString()}/result`;

    const result = await this.stripe.paymentIntents.confirm(paymentMethodId, {
      payment_method: paymentMethodId,
      return_url,
    });

    // update payment status
    payment.status = result.status;
    await payment.save();

    // update user membership
    const updatedUser = await this.usersService.updateMembership(
      user,
      updatedMembershipPlan.type,
    );

    const paymentPopulated = await payment.populate<{ userId: User }>('userId');
    const email = paymentPopulated.userId.email;
    const paymentDateFormat = formatDateFromSeconds(result.created);
    const dueDateFormat = updatedUser.membership.dueDate
      ? formatDateFromSeconds(updatedUser.membership.dueDate)
      : 'none';

    // send mail
    if (result.status === 'succeeded') {
      // payment success email
      await this.emailsService.sendPaymentSuccessEmail({
        to: email,
        data: {
          email,
          amount: result.amount,
          currency: result.currency.toUpperCase(),
          transactionId: result.id,
          paymentDate: paymentDateFormat,
        },
      });

      // membership plan confirm email
      await this.emailsService.sendMembershipPlanConfirmEmail({
        to: email,
        data: {
          email,
          membershipType: updatedMembershipPlan.type,
          dueDate: dueDateFormat,
        },
      });
    }

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
