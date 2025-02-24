import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

import { PaymentIntentStatus } from './types/payment-intent-status';

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
    ref: 'User',
    required: true,
  })
  userId?: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  stripeId: string;

  @Prop({
    type: String,
    required: true,
  })
  stripeObject: string;

  @Prop({
    type: Number,
    required: true,
  })
  amount: number;

  @Prop({
    type: String,
    default: null,
  })
  currency: string | null;

  @Prop({
    type: [String],
    required: true,
  })
  paymentMethodTypes: string[];

  @Prop({
    type: String,
    required: true,
  })
  status: PaymentIntentStatus;

  @Prop({
    type: SchemaTypes.Mixed,
    default: {},
  })
  metadata?: Record<string, any>;
}

export type PaymentDocument = HydratedDocument<Payment>;
export const PaymentSchema = SchemaFactory.createForClass(Payment);
