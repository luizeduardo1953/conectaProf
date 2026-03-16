import { Teacher } from "src/teachers/domain/entities/Teacher";
import { TeacherRepository } from "src/teachers/domain/repositories/TeacherRepository";
import { CreateTeacherDto } from "src/teachers/dto/create-teacher.dto";

export class CreateTeacher {
  constructor(private teacherRepository: TeacherRepository) {}

  async execute(data: CreateTeacherDto): Promise<Teacher> {
    const teacher = Teacher.create(data);
    return this.teacherRepository.create(teacher);
  }
}