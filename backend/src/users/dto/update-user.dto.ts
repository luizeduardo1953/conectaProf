import { IsOptional, IsString } from 'class-validator';
import { IsEmail } from 'class-validator';
import { IsEnum } from 'class-validator';
import { Role } from 'src/enums/role';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
