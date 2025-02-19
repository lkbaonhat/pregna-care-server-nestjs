import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFetalDiseaseDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @IsArray()
    affectedWeeks: number[];

    @IsNotEmpty()
    @IsString()
    severity: string;

    @IsString()
    @IsNotEmpty()
    criteria: Criteria;
}

class Criteria {
    weight: Range;
    BPD: Range;
    AC: Range;
    FL: Range;
    bpm: Range;
}

class Range {
    @IsNumber()
    @IsNotEmpty()
    min: number;

    @IsNumber()
    @IsNotEmpty()
    max: number;
}
