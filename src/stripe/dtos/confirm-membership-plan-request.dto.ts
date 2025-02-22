import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class ConfirmMembershipPlanRequestDto {
  @ApiProperty()
  @IsString()
  paymentIntentId: string;

  @ApiProperty()
  @IsMongoId()
  paymentMethodId: string;

  @ApiProperty()
  @IsString()
  plan: string;
}
