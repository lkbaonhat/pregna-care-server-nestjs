import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBlogPostDto {
    @IsString()
    @IsNotEmpty()
    author_id: string;

    @IsString()
    @IsNotEmpty()
    heading: string;

    @IsString()
    @IsNotEmpty()
    page_title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    feature_image_url: string;

    @IsString()
    @IsNotEmpty()
    url_handle: string;

    @IsString()
    @IsNotEmpty()
    published_date: string;

    @IsNotEmpty()
    is_active: boolean;
}

