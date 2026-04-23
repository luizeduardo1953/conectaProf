import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class UpdateTeacherDto {
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

