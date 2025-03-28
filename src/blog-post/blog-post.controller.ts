import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateBlogPostService } from './blog-post.service';
import { CreateBlogPostDto } from './dtos/create-blog-post.dto';
import { Request } from 'express';
import { UserDocument } from 'src/users/user.schema';
import { AdminGuard } from 'src/guards/admin.guard';
import { ApiQuery } from '@nestjs/swagger';
import { Response } from 'src/types/core';
import { Public } from 'src/constants/core';

@Controller('blog-post')
export class BlogPostController {
  constructor(private createBlogPostService: CreateBlogPostService) {}

  @Public()
  @Get('preview')
  @ApiQuery({
    name: 'week',
    required: false,
    type: Number,
    description: 'Week pregnancy',
  })
  async getBlogPostPreviewByWeek(
    @Query('week') week: number = 2,
  ): Promise<Response> {
    const data =
      await this.createBlogPostService.getBlogPostPreviewByWeek(week);
    return { data };
  }

  @UseGuards(AdminGuard)
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  async getBlogPostsAdmin(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Response> {
    const res = await this.createBlogPostService.getBlogPostsAdmin(page, limit);
    return { data: res };
  }

  @Public()
  @Get(':id')
  async getBlogPostDetail(@Param('id') id: string): Promise<Response> {
    const data = await this.createBlogPostService.getBlogPostDetail(id);
    return { data };
  }

  @UseGuards(AdminGuard)
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
