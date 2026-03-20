import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from 'src/users/domain/repositories/UserRepository';
import { UpdateUserInput, User } from 'src/users/domain/entities/User';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private prisma: PrismaService) { }

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

  async update(id: string, data: UpdateUserInput): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async save(user: User): Promise<void> {
    const data: Prisma.UserCreateInput = {
      id: user.id,
      name: user.name,
      email: user.email,
      password_hash: user.password_hash,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };

    // upsert: cria se não existe, atualiza se já existe
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: data,
      update: {
        name: user.name,
        email: user.email,
        password_hash: user.password_hash,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  }

}
