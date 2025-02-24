import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CheckoutLineItem } from './checkout-line-item.dto';

export class CheckoutSessionRequestDto {
  @ApiProperty({ isArray: true, type: CheckoutLineItem })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutLineItem)
  lineItems: CheckoutLineItem[];

  @ApiProperty({ type: String })
  @IsIn(['subscription', 'payment', 'setup'])
  mode: 'subscription' | 'payment' | 'setup';

  @ApiProperty({
    description:
      'The path on frontend to which Stripe should redirect the customer after payment. This is appended to the host configured in the StripeClientConfigurationService',
  })
  @IsString()
  successFrontendPath: string;

  @ApiPropertyOptional({
    description:
      'The path on frontend to which Stripe should redirect the customer after payment cancellation. This is appended to the host configured in the StripeClientConfigurationService',
  })
  @IsOptional()
  cancelFrontendPath?: string;
}
