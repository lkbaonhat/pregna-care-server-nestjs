import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckoutSessionResponseDto {
  @ApiProperty()
  @IsString()
  stripeSessionId: string;

  @ApiProperty()
  @IsString()
  stripeSessionUrl: string;
}
