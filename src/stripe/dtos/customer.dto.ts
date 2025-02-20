import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StripeCustomerDto {
  @ApiPropertyOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  paymentMethodId?: string;
}
