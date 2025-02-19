import { IsNumber, Min, IsString, IsNotEmpty } from "class-validator";

export class CreateFetusStandardDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    unit: string;

    @IsNotEmpty()
    weeks: Weeks[];
}

class Weeks {
    @IsNumber()
    @Min(0, { message: 'Week value must be greater than 0' })
    week: number;

    @IsNumber()
    @Min(0, { message: 'Min value must be greater than 0' })
    min: number;

    @IsNumber()
    @Min(0, { message: 'Max value must be greater than 0' })
    max: number;
}