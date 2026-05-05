import { IsOptional, IsString, IsNumber } from "class-validator";

export class UpdateAvailabilityDto {
    @IsOptional()
    @IsNumber()
    dayOfWeek?: number;

    @IsOptional()
    @IsString()
    startTime?: string;

    @IsOptional()
    @IsString()
    endTime?: string;

    @IsOptional()
    @IsString()
    teacherId?: string;
}