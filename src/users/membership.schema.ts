import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MembershipPlanTypes } from 'src/membership-plan/types/membership-plan';

@Schema({
  toJSON: {
    transform(_, ret) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
  _id: false,
})
export class Membership {
  @Prop({
    type: Date,
    default: null,
  })
  dueDate: Date | null;

  @Prop({
    type: String,
    enum: Object.values(MembershipPlanTypes),
    default: MembershipPlanTypes.Free,
  })
  plan: MembershipPlanTypes;
}

export type MembershipDocument = HydratedDocument<Membership>;
export const MembershipSchema = SchemaFactory.createForClass(Membership);
