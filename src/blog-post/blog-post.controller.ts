import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
} from '@nestjs/common';
import { Public } from 'src/constants/core';
import { CreateBlogPostService } from './blog-post.service';
import { CreateBlogPostDto } from './dtos/create-blog-post.dto';

@Controller('blog-post')
export class BlogPostController {
    constructor(private createBlogPostService: CreateBlogPostService) { }

    @Public()
    @Post()
    async createBlogPost(@Body() blogPost: CreateBlogPostDto) {
        try {
            return await this.createBlogPostService.createBlogPost(blogPost);
        } catch (error) {
            console.error('Controller error:', error);
            throw error;
        }
    }
}

