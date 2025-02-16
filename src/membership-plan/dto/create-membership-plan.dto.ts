import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateMembershipPlanDto {
    @IsString()
    @MaxLength(100)
    name: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsNumber()
    @Min(0)
    duration: number;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    description: string;

    @IsBoolean()
    isActive: boolean;

    @IsArray()
    @IsString({ each: true })
    benefits: string[];
}