import { IsNumber, Min, IsOptional, IsString, IsNotEmpty } from "class-validator";

export class CreateFetusStandardDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    unit: string;

    @IsNotEmpty()
    weeks: Weeks[];

    @IsOptional()
    isDeleted: boolean;
}

class Weeks {
    @IsNumber()
    @Min(0, { message: 'Min value must be greater than 0' })
    min: number;

    @IsNumber()
    @Min(0, { message: 'Max value must be greater than 0' })
    max: number;
}