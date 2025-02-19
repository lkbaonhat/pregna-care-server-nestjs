import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

class Range {
    @IsNumber()
    @IsNotEmpty()
    min: number;

    @IsNumber()
    @IsNotEmpty()
    max: number;
}
class Criteria {
    @ValidateNested()
    @Type(() => Range)
    weight?: Range;

    @ValidateNested()
    @Type(() => Range)
    BPD?: Range;

    @ValidateNested()
    @Type(() => Range)
    AC?: Range;

    @ValidateNested()
    @Type(() => Range)
    FL?: Range;

    @ValidateNested()
    @Type(() => Range)
    bpm?: Range;
}

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

    @ValidateNested()
    @Type(() => Criteria)
    criteria: Criteria;
}