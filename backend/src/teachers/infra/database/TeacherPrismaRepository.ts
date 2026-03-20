import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TeacherRepository } from 'src/teachers/domain/repositories/TeacherRepository';
import { UpdateTeacherInput, Teacher } from 'src/teachers/domain/entities/Teacher';

@Injectable()
export class TeacherPrismaRepository implements TeacherRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(teacher: Teacher): Promise<Teacher> {
    const data = await this.prisma.teacher.create({
      data: {
        id: teacher.id,
        userId: teacher.userId,
        biography: teacher.biography ?? '',
        training: teacher.training ?? '',
        priceHour: teacher.priceHour ?? 0,
        telephone: teacher.telephone ?? '',
      },
    });

    return new Teacher(data.id, {
      userId: data.userId,
      biography: data.biography,
      training: data.training,
      priceHour: data.priceHour ? Number(data.priceHour) : null,
      telephone: data.telephone,
    });
  }

  async findById(id: string): Promise<Teacher> {
    const data = await this.prisma.teacher.findUnique({
      where: { id },
    });

    if (!data) throw new NotFoundException('Professor não encontrado');

    return new Teacher(data.id, {
      userId: data.userId,
      biography: data.biography,
      training: data.training,
      priceHour: data.priceHour ? Number(data.priceHour) : null,
      telephone: data.telephone,
    });
  }

  async getAll(): Promise<Teacher[]> {
    const data = await this.prisma.teacher.findMany();

    return data.map(
      (t) =>
        new Teacher(t.id, {
          userId: t.userId,
          biography: t.biography,
          training: t.training,
          priceHour: t.priceHour ? Number(t.priceHour) : null,
          telephone: t.telephone,
        }),
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.teacher.delete({
      where: { id },
    });
  }

  async update(id: string, data: UpdateTeacherInput): Promise<Teacher> {
    const updated = await this.prisma.teacher.update({
      where: { id },
      data: {
        biography: data.biography ?? undefined,
        training: data.training ?? undefined,
        priceHour: data.priceHour ?? undefined,
        telephone: data.telephone ?? undefined,
      },
    });

    return new Teacher(updated.id, {
      userId: updated.userId,
      biography: updated.biography,
      training: updated.training,
      priceHour: updated.priceHour ? Number(updated.priceHour) : null,
      telephone: updated.telephone,
    });
  }
}