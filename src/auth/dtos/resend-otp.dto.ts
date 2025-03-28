import { IsEmail, IsMongoId, IsNotEmpty } from 'class-validator';

export class ResendOtpDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
