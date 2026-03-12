import { IsString, IsNotEmpty } from "class-validator";

export class AuthResponseDto {
    @IsNotEmpty()
    @IsString()
    token: string;

    @IsNotEmpty()
    @IsString()
    expireIn: string;
}