import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { VerificationMethod } from '../types/verification-method';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(VerificationMethod)
  verificationMethod?: VerificationMethod = VerificationMethod.Email;
}
