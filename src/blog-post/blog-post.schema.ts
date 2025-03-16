import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { BlogStatus } from './types/BlogStatus';

export type BlogPostDocument = HydratedDocument<BlogPost>;

@Schema({
  timestamps: true,
})
export class BlogPost {
  @Prop({ required: true })
  author_id: string;

  @Prop({ required: true })
  heading: string;

  @Prop({
    type: String,
    required: true,
    get: function (data: string) {
      return JSON.parse(data) as object;
    },
    set: function (data) {
      return JSON.stringify(data);
    },
  })
  content: object;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  feature_image_url: string;

  @Prop({ required: true })
  published_date: string;

  @Prop({ required: true, default: true })
  is_active: boolean;

  @Prop({
    required: true,
    enum: Object.values(BlogStatus),
    default: BlogStatus.Created,
  })
  status: BlogStatus;

  @Prop({ type: Number, default: -1 })
  week?: number;
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
