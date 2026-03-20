import { Injectable, NotFoundException } from '@nestjs/common';
import { Teacher } from 'src/teachers/domain/entities/Teacher';
import { TeacherPrismaRepository } from 'src/teachers/infra/database/TeacherPrismaRepository';

@Injectable()
export class FindTeacherByIdUseCase {
  constructor(private readonly teacherRepository: TeacherPrismaRepository) {}

  async execute(id: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findById(id);
    if (!teacher) throw new NotFoundException('Professor não encontrado');
    return teacher;
  }
}