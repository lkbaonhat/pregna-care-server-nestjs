import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

@Schema({ _id: false })
export class GrowthMetricData {
  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ required: true, default: 0 })
  unit: string;

  @Prop({ required: true, default: 0 })
  value: number;
}

@Schema({ _id: false })
export class GrowthMetricDataByWeek {
  @Prop({ type: Number, required: true })
  week: number;

  @Prop({ type: [GrowthMetricData], default: [] })
  data: GrowthMetricData[];
}

@Schema({ timestamps: true })
export class GrowthMetric {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Fetus' })
  fetusId: Types.ObjectId;

  @Prop({ type: [GrowthMetricDataByWeek], default: [] })
  data: GrowthMetricDataByWeek[];

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export type GrowthMetricDataDocument = HydratedDocument<GrowthMetricData>;
export type GrowthMetricDataByWeekDocument =
  HydratedDocument<GrowthMetricDataByWeek>;
export type GrowthMetricDocument = HydratedDocument<GrowthMetric>;
export const GrowthMetricSchema = SchemaFactory.createForClass(GrowthMetric);
