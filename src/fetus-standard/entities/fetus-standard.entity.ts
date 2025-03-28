import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class FetusStandard {
  @Prop({ required: true, default: '' })
  name: string; //E.g. weight

  @Prop({ required: true })
  unit: string; //E.g g

  @Prop()
  weeks: weeks[];

  @Prop({ default: false })
  isDeleted: boolean;
}

class weeks {
  @Prop({ required: true, default: 0 })
  week: number;

  @Prop({ required: true, default: 0 })
  min: number;

  @Prop({ required: true, default: 0 })
  max: number;
}

export type FetusStandardDocument = HydratedDocument<FetusStandard>;
export const FetusStandardSchema = SchemaFactory.createForClass(FetusStandard);
