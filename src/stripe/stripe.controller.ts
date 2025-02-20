import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { Response } from 'src/types/core';
import { StripeService } from './stripe.service';
import { UserDocument } from 'src/users/user.schema';
import { PaymentIntentRequestDto } from './dtos/payment-intent-request.dto';
import { AttachPaymentMethodDto } from './dtos/attach-payment-method-dto';
import { ConfirmPaymentIntentRequestDto } from './dtos/confirm-payment-intent-request.dto';

@ApiBearerAuth()
@Controller('payments/stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get('methods')
  async getPaymentMethods(@Req() req: Request): Promise<Response> {
    const user = req.user as UserDocument;
    const data = await this.stripeService.retrivePaymentMethodList(user);
    return { data: data.data };
  }

  @Post('methods')
  async attachPaymentMethod(
    @Req() req: Request,
    @Body() body: AttachPaymentMethodDto,
  ): Promise<Response> {
    const user = req.user as UserDocument;
    const data = await this.stripeService.attachPaymentMethodToCustomer(
      user,
      body,
    );
    return { data };
  }

  @Post('payment-intent')
  async createPaymentIntent(
    @Req() req: Request,
    @Body() body: PaymentIntentRequestDto,
  ): Promise<Response> {
    const user = req.user as UserDocument;
    const data = await this.stripeService.createPaymentIntent(user, body);
    return { data };
  }

  @Post('confirm-payment-intent')
  async confirmPaymentIntent(
    @Body() body: ConfirmPaymentIntentRequestDto,
  ): Promise<Response> {
    const data = await this.stripeService.confirmPaymentIntent(body);
    return { data };
  }
}
