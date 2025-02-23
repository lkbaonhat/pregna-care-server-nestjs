import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { UserRoles, UserStatus } from './types/user-status';
import { EMPTY_STRING } from '../constants/core';
import { hashPasswordHelper } from '../utils/helper';
import { MembershipDocument, MembershipSchema } from './membership.schema';
import { MembershipPlanTypes } from 'src/membership-plan/types/membership-plan';
import { PaymentDocument, PaymentSchema } from 'src/payments/payment.schema';

@Schema({
  toJSON: {
    transform(_, ret) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    },
  },
})
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
  })
  stripeCustomerId?: string;

  @Prop({
    type: String,
    enum: Object.values(UserRoles),
    default: UserRoles.Member,
  })
  role: UserRoles;

  @Prop({
    type: MembershipSchema,
    default: {
      plan: MembershipPlanTypes.Free,
      dueDate: null,
    },
  })
  membership: MembershipDocument;

  @Prop({
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.Registered,
  })
  status: UserStatus;

  @Prop({
    type: String,
    default: EMPTY_STRING,
  })
  phoneNumber: string;

  @Prop({
    type: String,
    default: EMPTY_STRING,
  })
  firstName: string;

  @Prop({
    type: String,
    default: EMPTY_STRING,
  })
  lastName: string;

  @Prop({
    type: Date,
    default: null,
  })
  dateOfBirth: Date;

  @Prop({
    type: String,
    default: null,
  })
  avatarUrl: string;

  @Prop({ type: String, default: 'Unknown' })
  bloodType: string;

  @Prop({ type: String, default: 'Unknown' })
  nationality: string;

  @Prop({ type: [PaymentSchema.omit(['userId'])], default: [] })
  transactions: Omit<PaymentDocument, 'userId'>[];
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashedPassword = await hashPasswordHelper(this.get('password'));
    if (!hashedPassword) {
      throw new Error('Failed to hash password');
    }
    this.set('password', hashedPassword);
  }
  done();
});
