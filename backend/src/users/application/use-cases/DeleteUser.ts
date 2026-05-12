import { Injectable, NotFoundException } from '@nestjs/common';
import { UserPrismaRepository } from 'src/users/infra/database/UserPrismaRepository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DeleteUser {
  constructor(
    private readonly userRepository: UserPrismaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    // Remove todas as dependências em cascata numa única transação
    await this.prisma.$transaction(async (tx) => {
      // 1. Agendamentos onde o usuário é aluno
      await tx.scheduling.deleteMany({ where: { studentId: userId } });

      // 2. Se for professor: agendamentos + disponibilidades + disciplinas vinculadas + perfil
      const teacher = await tx.teacher.findUnique({ where: { userId } });
      if (teacher) {
        await tx.scheduling.deleteMany({ where: { teacherId: teacher.id } });
        await tx.availability.deleteMany({ where: { teacherId: teacher.id } });
        await tx.teacherDiscipline.deleteMany({ where: { teacherId: teacher.id } });
        await tx.teacher.delete({ where: { id: teacher.id } });
      }

      // 3. Deleta o usuário
      await tx.user.delete({ where: { id: userId } });
    });
  }
}
