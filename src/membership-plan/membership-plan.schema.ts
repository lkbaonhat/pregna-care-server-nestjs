import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EMPTY_STRING } from 'src/constants/core';
import { MembershipPlanTypes } from './types/membership-plan';

@Schema({
  timestamps: true,
  toJSON: {
    transform(_, ret) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class MembershipPlan {
  @Prop({
    type: String,
    default: EMPTY_STRING,
  })
  name: string;
  @Prop({
    type: Number,
    default: 0,
  })
  price: number;
  @Prop({
    type: String,
    enum: Object.values(MembershipPlanTypes),
    unique: true,
  })
  type: MembershipPlanTypes;
  @Prop({
    type: String,
    default: EMPTY_STRING,
  })
  description: string;
  @Prop({
    type: Boolean,
    default: false,
  })
  isActive?: boolean;
  @Prop({
    type: [String],
    default: [],
  })
  benefits: string[];
}

export type MembershipPlanDocument = MembershipPlan & Document;
export const MembershipPlanSchema =
  SchemaFactory.createForClass(MembershipPlan);
