import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateBlogPostDto } from './dtos/create-blog-post.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BlogPost } from './blog-post.schema';
import { BlogStatus } from './types/BlogStatus';
import { UserDocument } from 'src/users/user.schema';

@Injectable()
export class CreateBlogPostService {
    constructor(
        @Inject(ConfigService) private configService: ConfigService,
        @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPost>,
    ) { }

    async createBlogPost(blogPost: CreateBlogPostDto, user: UserDocument) {
        try {
            // Create and save the blog post with processed content
            const newBlogPost = new this.blogPostModel({
                ...blogPost,
                author_id: user._id,
            });

            const savedPost = await newBlogPost.save();

            return {
                success: true,
                post: savedPost,
                message: 'Blog post created successfully',
            };
        } catch (error) {
            console.error('Blog post creation error:', error);
            throw new BadRequestException(
                `Failed to create blog post: ${error.message}`,
            );
        }
    }
}
