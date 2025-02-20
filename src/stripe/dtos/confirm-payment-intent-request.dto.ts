import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmPaymentIntentRequestDto {
  @ApiProperty()
  @IsString()
  paymentIntentId: string;

  @ApiProperty()
  @IsString()
  paymentMethodId: string;
}
