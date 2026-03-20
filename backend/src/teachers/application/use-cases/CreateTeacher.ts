import { Injectable, NotFoundException } from '@nestjs/common';
import { Teacher } from 'src/teachers/domain/entities/Teacher';
import { TeacherPrismaRepository } from 'src/teachers/infra/database/TeacherPrismaRepository';
import { CreateTeacherDto } from 'src/teachers/dto/create-teacher.dto';
import { UserPrismaRepository } from 'src/users/infra/database/UserPrismaRepository';

@Injectable()
export class CreateTeacherUseCase {
  constructor(
    private readonly teacherRepository: TeacherPrismaRepository,
    private readonly userRepository: UserPrismaRepository,
  ) {}

  async execute(data: CreateTeacherDto): Promise<Teacher> {
    const userExists = await this.userRepository.findById(data.userId);

    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const teacher = Teacher.create(data);
    return this.teacherRepository.create(teacher);
  }
}
