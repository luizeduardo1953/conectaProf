import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from 'src/users/domain/repositories/UserRepository';
import { User } from 'src/users/domain/entities/User';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
        role: user.role,
        firebaseUid: user.firebaseUid,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        firebaseUid: user.firebaseUid ?? null,
        createdAt: user.createdAt,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = (await this.prisma.user.findUnique({
      where: { email },
    })) as User | null;

    return data;
  }

  async findById(id: string): Promise<User | null> {
    const data = (await this.prisma.user.findUnique({
      where: { id },
    })) as User | null;
    return data;
  }

  async findAll(): Promise<User[]> {
    const data = (await this.prisma.user.findMany()) as User[];
    return data;
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
