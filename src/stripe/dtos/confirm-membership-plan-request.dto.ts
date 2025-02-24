import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmMembershipPlanRequestDto {
  @ApiProperty()
  @IsString()
  intent: string;

  @ApiProperty()
  @IsString()
  paymentMethod: string;
}
