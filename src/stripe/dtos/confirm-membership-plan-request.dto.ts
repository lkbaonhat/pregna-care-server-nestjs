import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmMembershipPlanRequestDto {
  @ApiProperty()
  @IsString()
  intentId: string;

  @ApiProperty()
  @IsString()
  paymentMethodId: string;
}
