import { IsOptional, IsString } from 'class-validator';
import { IsEmail } from 'class-validator';
import { IsEnum } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  passwordHash?: string;

  @IsEnum(['teacher', 'student', 'admin'])
  @IsOptional()
  role?: string;
}
