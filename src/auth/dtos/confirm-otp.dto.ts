import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmOtpDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
