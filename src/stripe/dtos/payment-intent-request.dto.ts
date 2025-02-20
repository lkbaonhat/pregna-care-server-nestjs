import { ApiProperty } from '@nestjs/swagger';
import { IsCurrency, IsInt, IsPositive, IsString } from 'class-validator';

export class PaymentIntentRequestDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  amount: number;

  @ApiProperty()
  @IsCurrency()
  currency: string;

  @ApiProperty()
  @IsString()
  payment_method: string;

  @ApiProperty()
  @IsString()
  description: string;
}
