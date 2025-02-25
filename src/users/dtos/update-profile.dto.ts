import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  phoneNumber?: string;

  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  bloodType?: string;

  @IsInt()
  dateOfBirth?: number; // Timestamp dạng giây
}
