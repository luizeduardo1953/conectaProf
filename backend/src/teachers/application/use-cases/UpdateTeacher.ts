import { TeacherRepository } from "src/teachers/domain/repositories/TeacherRepository";
import { Teacher } from "src/teachers/domain/entities/Teacher";

export class UpdateTeacher {
    constructor(private teacherRepository: TeacherRepository) {}

    async execute(id: string): Promise<Teacher | null> {
        return this.teacherRepository.findById(id);
    }
}