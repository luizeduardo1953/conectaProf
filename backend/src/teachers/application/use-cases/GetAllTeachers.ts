import { TeacherRepository } from "src/teachers/domain/repositories/TeacherRepository";
import { Teacher } from "src/teachers/domain/entities/Teacher";

export class GetAllTeachers {
    constructor(private teacherRepository: TeacherRepository) {}

    async execute(): Promise<Teacher[]> {
        return this.teacherRepository.getAll();
    }
}   