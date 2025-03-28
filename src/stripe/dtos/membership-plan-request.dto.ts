import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class MembershipPlanRequestDto {
  @ApiProperty()
  @IsMongoId()
  plan: string;

  @ApiProperty()
  @IsString()
  paymentMethod: string;
}
