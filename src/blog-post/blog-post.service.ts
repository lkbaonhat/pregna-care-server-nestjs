import {
    BadRequestException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { CreateBlogPostDto } from './dtos/create-blog-post.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BlogPost } from './blog-post.schema';
import { BlogStatus } from './types/BlogStatus';
import { S3Service } from 'src/s3/s3.service';
import { UserDocument } from 'src/users/user.schema';

@Injectable()
export class CreateBlogPostService {
    constructor(
        @Inject(ConfigService) private configService: ConfigService,
        private userService: UsersService,
        @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPost>,
        private s3Service: S3Service,
    ) { }

    async createBlogPost(blogPost: CreateBlogPostDto, user: UserDocument) {
        try {

            // Create and save the blog post with processed content
            const newBlogPost = new this.blogPostModel({
                ...blogPost,
                author_id: user._id,
                status: BlogStatus.Published
            });

            const savedPost = await newBlogPost.save();

            return {
                success: true,
                post: savedPost,
                message: 'Blog post created successfully'
            };
        } catch (error) {
            console.error('Blog post creation error:', error);
            if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
                throw error;
            }
            throw new BadRequestException(
                `Failed to create blog post: ${error.message}`
            );
        }
    }
}