export class CreateSchedulingDto {
    teacherId: string;
    studentId: string;
    disciplineId: string;
    dateHourStart: string;
    dateHourEnd: string;
    observation?: string;
}
