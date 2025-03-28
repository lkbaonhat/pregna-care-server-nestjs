import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsISO4217CurrencyCode,
  IsPositive,
  IsString,
} from 'class-validator';

export class PaymentIntentRequestDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  amount: number;

  @ApiProperty()
  @IsISO4217CurrencyCode()
  currency: string;

  @ApiProperty()
  @IsString()
  payment_method: string;

  @ApiProperty()
  @IsString()
  description: string;
}
