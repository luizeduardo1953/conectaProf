import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateAvailabilityDto {
    @IsNotEmpty()
    @IsNumber()
    dayOfWeek: number;

    @IsNotEmpty()
    @IsString()
    startTime: string;

    @IsNotEmpty()
    @IsString()
    endTime: string;

    @IsNotEmpty()
    @IsString()
    teacherId: string;
}
