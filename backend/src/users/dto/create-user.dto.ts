import { IsString } from 'class-validator';
import { IsEmail } from 'class-validator';
import { IsEnum } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { Role } from 'src/enums/role';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  role: Role
}
