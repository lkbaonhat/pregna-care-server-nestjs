import { IsString, IsNotEmpty, IsInt, IsNumber, IsJSON } from 'class-validator';

export class CreateBlogPostDto {

    @IsString()
    @IsNotEmpty()
    heading: string;

    @IsNotEmpty()
    @IsJSON()
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

    @IsNotEmpty()
    is_active: boolean;
}

