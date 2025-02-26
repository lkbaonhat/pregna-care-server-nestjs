import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogPostDocument = HydratedDocument<BlogPost>;

@Schema({
    timestamps: true,
})
export class BlogPost {
    @Prop({ required: true })
    author_id: string;

    @Prop({ required: true })
    heading: string;

    @Prop({ required: true })
    page_title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    feature_image_url: string;

    @Prop({ required: true })
    url_handle: string;

    @Prop({ required: true })
    published_date: string;

    @Prop({ required: true, default: true })
    is_active: boolean;

    @Prop({ required: true, default: 'published' })
    status: string;
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
