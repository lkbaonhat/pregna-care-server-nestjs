import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export class FetalDisease {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    affectedWeeks: number[];

    @Prop({ required: true, enum: ['low', 'moderate', 'high', 'critical'] })
    severity: string;

    @Prop({ required: true })
    criteria: Criteria;
}

class Criteria {
    @Prop({ required: true })
    weight: Range;

    @Prop({ required: true })
    BPD: Range;

    @Prop({ required: true })
    AC: Range;

    @Prop({ required: true })
    FL: Range;

    @Prop({ required: true })
    bpm: Range;
}

class Range {
    @Prop({ required: true })
    min: number;

    @Prop({ required: true })
    max: number;
}


export type FetalDiseaseDocument = HydratedDocument<FetalDisease>;
export const FetalDiseaseSchema = SchemaFactory.createForClass(FetalDisease);
