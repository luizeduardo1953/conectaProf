import { IsNotEmpty, IsString } from "class-validator";

export class UpdateDisciplineDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}