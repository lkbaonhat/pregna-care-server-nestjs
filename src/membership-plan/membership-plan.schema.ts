import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { EMPTY_STRING } from "src/constants/core";

@Schema({
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  })
export class MembershipPlan {
    @Prop({
        type: String,
        default: EMPTY_STRING
    })
    name: string;
    @Prop({
        type: Number,
        default: 0
    })
    price: number;
    @Prop({
        type: Number,
        default: 0
    })
    duration: number;
    @Prop({
        type: String,
        default: EMPTY_STRING
    })
    description: string;
    @Prop({
        type: Boolean,
        default: false
    })
    isActive: boolean;
    @Prop({
        type: [String],
        default: []
    })
    benefits: string[];
}

export type MembershipPlanDocument = MembershipPlan & Document;
export const MembershipPlanSchema = SchemaFactory.createForClass(MembershipPlan);
