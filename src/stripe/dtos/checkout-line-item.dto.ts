import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CheckoutLineItem {
  @ApiProperty()
  @IsString()
  price: string;

  @ApiProperty()
  @IsInt()
  quantity: number;
}
