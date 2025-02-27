import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class GrowthMetric {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Fetus' })
  fetusId: Types.ObjectId;

  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ required: true, default: 0 })
  unit: string;

  @Prop({ required: true, default: 0 })
  value: number;

  @Prop({ required: true, default: 0 })
  week: number;

  @Prop({ default: false })
  isDeleted: boolean;
}

export type GrowthMetricDocument = HydratedDocument<GrowthMetric>;
export const GrowthMetricSchema = SchemaFactory.createForClass(GrowthMetric);
