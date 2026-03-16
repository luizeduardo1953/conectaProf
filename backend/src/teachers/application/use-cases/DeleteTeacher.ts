import { TeacherRepository } from "src/teachers/domain/repositories/TeacherRepository";

export class DeleteTeacher {
    constructor(private teacherRepository: TeacherRepository) {}

    async execute(id: string): Promise<void> {
        await this.teacherRepository.delete(id);
    }
}