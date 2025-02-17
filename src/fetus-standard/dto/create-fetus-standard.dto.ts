import { IsNumber, Min, Max, IsOptional, IsString, IsNotEmpty } from "class-validator";

export class CreateFetusStandardDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    unit: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @Min(0, { message: 'Min value must be greater than 0' })
    @IsNotEmpty()
    minValue: number;

    @IsNumber()
    @Min(0, { message: 'Max value must be greater than 0' })
    @IsNotEmpty()
    maxValue: number;

    @IsNumber()
    @Min(1, { message: 'Week must be greater than 0' })
    @Max(40, { message: 'Week must be less than 40' })
    @IsNotEmpty()
    week: number;

    @IsOptional()
    isDeleted: boolean;
}
