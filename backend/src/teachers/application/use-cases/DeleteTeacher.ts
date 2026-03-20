import { Injectable, NotFoundException } from '@nestjs/common';
import { TeacherPrismaRepository } from 'src/teachers/infra/database/TeacherPrismaRepository';

@Injectable()
export class DeleteTeacherUseCase {
  constructor(private readonly teacherRepository: TeacherPrismaRepository) {}

  async execute(id: string): Promise<void> {
    const teacher = await this.teacherRepository.findById(id);
    if (!teacher) throw new NotFoundException('Professor não encontrado');
    await this.teacherRepository.delete(id);
  }
}