import { IsUUID, IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class CreateTeacherDto {
  @IsUUID()
  userId: string;

  @IsString()
  @IsOptional()
  biography?: string;

  @IsString()
  @IsOptional()
  training?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  priceHour?: number;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsString()
  @IsOptional()
  location?: string;
}