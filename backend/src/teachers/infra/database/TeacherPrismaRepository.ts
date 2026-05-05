import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TeacherRepository } from 'src/teachers/domain/repositories/TeacherRepository';
import { UpdateTeacherInput, Teacher } from 'src/teachers/domain/entities/Teacher';

@Injectable()
export class TeacherPrismaRepository implements TeacherRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToTeacher(t: any): Teacher {
    return new Teacher(t.id, {
      userId: t.userId,
      biography: t.biography,
      training: t.training,
      priceHour: t.priceHour ? Number(t.priceHour) : null,
      telephone: t.telephone,
      location: t.location ?? null,
      availabilities: t.availabilities ?? [],
      user: t.user ?? null,
      disciplines: t.disciplines ?? [],
    });
  }

  async create(teacher: Teacher): Promise<Teacher> {
    const data = await this.prisma.teacher.create({
      data: {
        id: teacher.id,
        userId: teacher.userId,
        biography: teacher.biography ?? '',
        training: teacher.training ?? '',
        priceHour: teacher.priceHour ?? 0,
        telephone: teacher.telephone ?? '',
        location: teacher.location ?? null,
      },
      include: {
        availabilities: true,
        user: true,
        disciplines: { include: { discipline: true } },
      },
    });

    return this.mapToTeacher(data);
  }

  async findById(id: string): Promise<Teacher> {
    const data = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        availabilities: true,
        user: true,
        disciplines: { include: { discipline: true } },
      },
    });

    if (!data) throw new NotFoundException('Professor não encontrado');

    return this.mapToTeacher(data);
  }

  async getAll(): Promise<Teacher[]> {
    const data = await this.prisma.teacher.findMany({
      include: {
        availabilities: true,
        user: true,
        disciplines: { include: { discipline: true } },
      },
    });

    return data.map((t) => this.mapToTeacher(t));
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
        location: data.location ?? undefined,
      },
      include: {
        availabilities: true,
        user: true,
        disciplines: { include: { discipline: true } },
      },
    });

    return this.mapToTeacher(updated);
  }
}