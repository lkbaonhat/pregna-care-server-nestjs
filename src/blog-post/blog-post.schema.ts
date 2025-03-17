import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { BlogStatus } from './types/BlogStatus';

export type BlogPostDocument = HydratedDocument<BlogPost>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class BlogPost {
  @Prop({ required: true })
  author_id: string;

  @Prop({ required: true })
  heading: string;

  @Prop({
    type: SchemaTypes.Mixed,
    required: true,
  })
  content: unknown;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  feature_image_url: string;

  @Prop({ type: Number, required: true })
  published_date: number;

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
