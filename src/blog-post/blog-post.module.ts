import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogPostController } from './blog-post.controller';
import { UsersModule } from 'src/users/users.module';
import { CreateBlogPostService } from './blog-post.service';
import { BlogPost, BlogPostSchema } from './blog-post.schema';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [
    UsersModule,
    S3Module,
    MongooseModule.forFeature([{ name: BlogPost.name, schema: BlogPostSchema }]),
  ],
  controllers: [BlogPostController],
  providers: [CreateBlogPostService],
  exports: [CreateBlogPostService],
})
export class CreateBlogPostModule { }
