export class CreateTeacherDto {
    firebaseUid: string;
    name: string;
    email: string;
    role: string;
    biography?: string;
    training?: string;
    priceHour?: number;
    telephone?: string;
}