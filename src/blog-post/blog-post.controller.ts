import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateBlogPostService } from './blog-post.service';
import { CreateBlogPostDto } from './dtos/create-blog-post.dto';
import { Request } from 'express';
import { UserDocument } from 'src/users/user.schema';

@Controller('blog-post')
export class BlogPostController {
  constructor(private createBlogPostService: CreateBlogPostService) {}

  @Post()
  async createBlogPost(
    @Body() blogPost: CreateBlogPostDto,
    @Req() req: Request,
  ) {
    try {
      const user = req.user as UserDocument;
      return await this.createBlogPostService.createBlogPost(blogPost, user);
    } catch (error) {
      console.error('Controller error:', error);
      throw error;
    }
  }
}
