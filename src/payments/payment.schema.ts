import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

import { User } from 'src/users/user.schema';

@Schema({
  toJSON: {
    transform(_, ret) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ret.id = ret._id;
      ret.stripeData = JSON.stringify(ret.stripeData, undefined, 4);
      delete ret._id;
      delete ret.__v;
    },
  },
  timestamps: true,
})
export class Payment {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: String,
    default: null,
  })
  stripeSessionId: string;

  @Prop({
    type: String,
    default: null,
  })
  stripeObjectType: string;

  @Prop({
    type: SchemaTypes.Mixed,
    default: null,
  })
  stripeData: unknown;
}

export type PaymentDocument = HydratedDocument<Payment>;
export const PaymentSchema = SchemaFactory.createForClass(Payment);
