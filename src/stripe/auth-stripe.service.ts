import { Injectable, Logger } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { StripeService } from './stripe.service';

import { UserDocument } from 'src/users/user.schema';
import { StripeCheckoutSessionRequestDto } from './dtos/stripe-checkout-session-request.dto';

@Injectable()
export class AuthStripeService {
  private readonly logger = new Logger(AuthStripeService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly stripeService: StripeService,
  ) {}

  public async createCheckoutSession(
    parameters: StripeCheckoutSessionRequestDto,
    requestUser: Partial<UserDocument>,
  ) {
    const userId = requestUser._id?.toString();
    const user = await this.usersService.findById(userId!);
    if (!user) {
      this.logger.error('User not found', { userId });
      throw new Error('User not found');
    }

    // Check if user

    return this.stripeService.createCheckoutSession(parameters, requestUser);
  }
}
