import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  ) {}

  async getBlogPostsAdmin(page: number, limit: number) {
    try {
      const [data, total] = await Promise.all([
        this.blogPostModel
          .find()
          .skip((page - 1) * limit)
          .limit(limit)
          .select('-content'),
        this.blogPostModel.countDocuments(),
      ]);

      return {
        data,
        pagination: {
          total,
          page,
          limit,
          nextPage: total > page * limit ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null,
        },
      };
    } catch (error) {
      console.error('Blog post fetching error:', error);
      throw new BadRequestException(
        `Failed to fetch blog posts: ${error.message}`,
      );
    }
  }

  async getBlogPostPreviewByWeek(week: number) {
    const post = await this.blogPostModel
      .findOne({
        week,
      })
      .select('-content');

    console.log(post);

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    return post;
  }

  async getBlogPostDetail(id: string) {
    const post = await this.blogPostModel.findById(id);

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    return post;
  }

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
