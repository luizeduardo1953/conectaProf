import { IsString } from 'class-validator';
import { IsEmail } from 'class-validator';
import { MinLength } from 'class-validator';
import { IsEnum } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  passwordHash: string;

  @IsEnum(['teacher', 'student', 'admin'])
  role: string;
}
