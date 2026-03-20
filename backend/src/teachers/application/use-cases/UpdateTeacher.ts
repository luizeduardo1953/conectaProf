import { Injectable, NotFoundException } from '@nestjs/common';
import { Teacher } from 'src/teachers/domain/entities/Teacher';
import { TeacherPrismaRepository } from 'src/teachers/infra/database/TeacherPrismaRepository';
import { UpdateTeacherDto } from 'src/teachers/dto/update-teacher.dto';
import { UpdateTeacherInput } from 'src/teachers/domain/entities/Teacher';

@Injectable()
export class UpdateTeacherUseCase {
  constructor(private readonly teacherRepository: TeacherPrismaRepository) {}

  async execute(id: string, data: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.teacherRepository.findById(id);

    if (!teacher) {
      throw new NotFoundException('Professor não encontrado');
    }

    const updateData: UpdateTeacherInput = {
      biography: data.biography,
      training: data.training,
      priceHour: data.priceHour,
      telephone: data.telephone,
    };

    return this.teacherRepository.update(id, updateData);
  }
}