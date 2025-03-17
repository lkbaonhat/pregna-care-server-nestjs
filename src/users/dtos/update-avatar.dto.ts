import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAvatarDto {
  @ApiProperty({ required: false, description: 'URL of avatar from S3' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
