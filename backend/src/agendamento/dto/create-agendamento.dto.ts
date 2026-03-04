export class CreateAgendamentoDto {
    teacherId: string;
    studentId: string;
    disciplineId: string;
    dateHourStart: string; // ISO DateTime string
    dateHourEnd: string; // ISO DateTime string
    observation?: string;
}
