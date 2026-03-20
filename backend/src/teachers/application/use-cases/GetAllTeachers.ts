import { Injectable } from '@nestjs/common';
import { Teacher } from 'src/teachers/domain/entities/Teacher';
import { TeacherPrismaRepository } from 'src/teachers/infra/database/TeacherPrismaRepository';

@Injectable()
export class GetAllTeachersUseCase {
  constructor(private readonly teacherRepository: TeacherPrismaRepository) {}

  async execute(): Promise<Teacher[]> {
    return this.teacherRepository.getAll();
  }
}