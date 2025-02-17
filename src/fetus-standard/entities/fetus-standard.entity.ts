import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ timestamps: true })
export class FetusStandard {
    @Prop({ required: true, default: '' })
    name: string;

    @Prop({ required: true })
    unit: string;

    @Prop({ required: true, default: '' })
    description: string;

    @Prop({ required: true, default: 0 })
    minValue: number;

    @Prop({ required: true, default: 0 })
    maxValue: number;

    @Prop({ required: true, min: 1, max: 40, default: 1 })
    week: number;

    @Prop({ default: false })
    isDeleted: boolean;
}

export type FetusStandardDocument = HydratedDocument<FetusStandard>;
export const FetusStandardSchema = SchemaFactory.createForClass(FetusStandard);
