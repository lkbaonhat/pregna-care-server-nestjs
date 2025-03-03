import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AttachPaymentMethodDto {
  @ApiProperty()
  @IsString()
  paymentMethodId: string;
}
