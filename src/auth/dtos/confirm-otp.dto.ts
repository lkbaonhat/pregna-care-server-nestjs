import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmOtpDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
