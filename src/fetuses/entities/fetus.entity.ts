import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { FetusGender } from '../types/gender.type';
import { User } from 'src/users/user.schema';

@Schema({ timestamps: true })
export class Fetus {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId?: Types.ObjectId;

  @Prop({ type: String, required: true, default: '' })
  name: string;

  @Prop({ type: Number, required: true })
  dueDate: number;

  @Prop({ type: String, enum: Object.values(FetusGender), required: true })
  gender: string;

  @Prop({ default: false })
  isDeleted: boolean;
}
export type FetusDocument = HydratedDocument<Fetus>;
export const FetusSchema = SchemaFactory.createForClass(Fetus);
