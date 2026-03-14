import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail, IsEnum } from "class-validator";
import { Role } from "src/enums/role";

export class SignInResponseDto {
    @IsNotEmpty()
    @IsString()
    token: string;

    @IsNotEmpty()
    @IsString()
    expiresIn: string;
}

export class SignInRequestDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
    @MaxLength(20, { message: 'A senha deve ter no máximo 20 caracteres.' })
    password: string;
}

export class SignUpResponseDto {
    id: string;
    name: string;
    email: string;
    role: Role;
}

export class SignUpRequestDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres.' })
    @MaxLength(255, { message: 'O nome deve ter no máximo 255 caracteres.' })
    name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
    @MaxLength(20, { message: 'A senha deve ter no máximo 20 caracteres.' })
    password_hash: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(Role)
    role: Role;
}