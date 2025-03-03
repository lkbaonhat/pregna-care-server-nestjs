import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { FetusGender } from '../types/gender.type';

@Schema({
  toJSON: {
    transform(_, ret) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
  timestamps: true,
})
export class Fetus {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId?: Types.ObjectId;

  @Prop({ type: String, required: true, default: '' })
  name: string;

  @Prop({ type: Number, required: true })
  dueDate: number;

  @Prop({ type: String, enum: Object.values(FetusGender), required: true })
  gender: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'GrowthMetric' })
  metrics?: Types.ObjectId;
}
export type FetusDocument = HydratedDocument<Fetus>;
export const FetusSchema = SchemaFactory.createForClass(Fetus);
