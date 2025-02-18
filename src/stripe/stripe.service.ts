import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { PaymentsService } from 'src/payments/payments.service';
import { StripeCheckoutSessionRequestDto } from './dtos/stripe-checkout-session-request.dto';
import { StripeCheckoutSessionResponseDto } from './dtos/stripe-checkout-session-response.dto';
import { UserDocument } from 'src/users/user.schema';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;
  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    private readonly paymentsService: PaymentsService,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2025-01-27.acacia',
        appInfo: {
          name: 'Pregnancy Tracker',
        },
      },
    );
  }

  public async createCheckoutSession(
    parameters: StripeCheckoutSessionRequestDto,
    requestUser: Partial<UserDocument>,
  ): Promise<StripeCheckoutSessionResponseDto> {
    const paymentReference = await this.paymentsService.create(requestUser);
    const stripeRedirectsBaseUrl = this.configService.getOrThrow<string>(
      'STRIPE_REDIRECT_BASE_URL',
    );

    const mappedSessionParameters: Stripe.Checkout.SessionCreateParams = {
      mode: parameters.mode as Stripe.Checkout.SessionCreateParams.Mode,
      client_reference_id: paymentReference._id.toString(),
      line_items: parameters.lineItems,
      success_url: `${stripeRedirectsBaseUrl}${parameters.successFrontendPath}`,
      cancel_url: parameters.cancelFrontendPath
        ? `${stripeRedirectsBaseUrl}${parameters.cancelFrontendPath}`
        : undefined,
    };

    const session = await this.stripe.checkout.sessions.create(
      mappedSessionParameters,
    );

    if (!session.url) {
      this.logger.error('Failed to create stripe checkout session', {
        mappedSessionParameters,
      });
      throw new Error('Failed to create checkout session');
    }

    return { stripeSessionUrl: session.url, stripeSessionId: session.id };
  }
}
