import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlogPostController } from './blog-post.controller';
import { UsersModule } from 'src/users/users.module';

import { CreateBlogPostService } from './blog-post.service';
import { BlogPost, BlogPostSchema } from './blog-post.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: BlogPost.name, schema: BlogPostSchema }]),
  ],
  controllers: [BlogPostController],
  providers: [CreateBlogPostService],
  exports: [CreateBlogPostService],
})
export class CreateBlogPostModule { }
