import { IsUUID, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateSchedulingDto {
    @IsUUID()
    teacherId: string;

    @IsUUID()
    disciplineId: string;

    @IsDateString()
    dateHourStart: string;

    @IsDateString()
    dateHourEnd: string;

    @IsOptional()
    @IsString()
    observation?: string;
}
