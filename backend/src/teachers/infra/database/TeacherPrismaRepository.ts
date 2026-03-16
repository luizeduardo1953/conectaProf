import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { TeacherRepository } from 'src/teachers/domain/repositories/TeacherRepository';
import { Teacher } from 'src/teachers/domain/entities/Teacher';
import { UpdateTeacherDto } from 'src/teachers/dto/update-teacher.dto';

@Injectable()
export class TeacherPrismaRepository implements TeacherRepository {
  constructor(private readonly prisma: PrismaService) {}

async create(teacher: Teacher): Promise<Teacher> {

    if(!teacher.telephone){
        teacher.telephone = "";
    }

    if(!teacher.priceHour){
        teacher.priceHour = 0;
    }

  const data = await this.prisma.teacher.create({
    data: {
      id: teacher.id,
      userId: teacher.userId,
      biography: teacher.biography,
      training: teacher.training,
      priceHour: teacher.priceHour,
      telephone: teacher.telephone,
    },
  });

  return new Teacher(
    data.id, {
    userId: data.userId,
    biography: data.biography,
    training: data.training,
    priceHour: data.priceHour ? Number(data.priceHour) : null,
    telephone: data.telephone,
  });
}

  async findById(id: string): Promise<Teacher | null> {
    const data = await this.prisma.teacher.findUnique({
      where: { id },
    });

    if (!data) return null;

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

  async update(id: string, teacher: UpdateTeacherDto): Promise<Teacher> {
    const data = await this.prisma.teacher.update({
      where: { id },
      data: {
        biography: teacher.biography,
        training: teacher.training,
        priceHour: teacher.priceHour,
        telephone: teacher.telephone,
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
}