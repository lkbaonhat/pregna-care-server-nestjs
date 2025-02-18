import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { AuthStripeService } from './auth-stripe.service';
import { Response } from 'src/types/core';
import { StripeCheckoutSessionRequestDto } from './dtos/stripe-checkout-session-request.dto';

@ApiBearerAuth()
@Controller('payments/stripe')
export class StripeController {
  constructor(private readonly authStripeService: AuthStripeService) {}

  @Post('checkout-session')
  async createCheckoutSession(
    @Req() req: Request,
    @Body() createSessionBody: StripeCheckoutSessionRequestDto,
  ): Promise<Response> {
    const session = await this.authStripeService.createCheckoutSession(
      createSessionBody,
      req.user!,
    );
    return { data: session };
  }
}
