import { IsString, IsNotEmpty, IsInt, IsNumber, IsEnum } from 'class-validator';
import { BlogStatus } from '../types/BlogStatus';

export class CreateBlogPostDto {
    @IsString()
    @IsNotEmpty()
    heading: string;

    @IsNotEmpty()
    content: unknown;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    feature_image_url: string;

    @IsInt()
    week: number;

    @IsNumber()
    @IsNotEmpty()
    published_date: number;
}
