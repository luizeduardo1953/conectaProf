import { Role } from "src/enums/role";

export class CreateTeacherDto {
    name: string;
    email: string;
    password: string
    role: Role;
    biography?: string;
    training?: string;
    priceHour?: number;
    telephone?: string;
}