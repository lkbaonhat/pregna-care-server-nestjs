import {
    BadRequestException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { CreateBlogPostDto } from './dtos/create-blog-post.dto';
import { UserStatus } from 'src/users/types/user-status';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BlogPost } from './blog-post.schema';
@Injectable()
export class CreateBlogPostService {
    constructor(
        @Inject(ConfigService) private configService: ConfigService,
        private userService: UsersService,
        @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPost>,
    ) { }

    async createBlogPost(blogPost: CreateBlogPostDto) {
        try {
            // Validate user existence and status
            const user = await this.userService.findById(blogPost.author_id.toString());
            if (!user) {
                throw new BadRequestException('Invalid author_id: User not found');
            }
            if (user.status !== UserStatus.Active) {
                throw new UnauthorizedException('User account is not active');
            }

            // Create and save the blog post
            const newBlogPost = new this.blogPostModel({
                ...blogPost,
                status: 'published'
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