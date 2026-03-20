import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from 'src/users/domain/entities/User';
import { UserPrismaRepository } from 'src/users/infra/database/UserPrismaRepository';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class UpdateUser {
  constructor(private readonly userRepository: UserPrismaRepository) {}

  async execute(id: string, data: UpdateUserDto): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const updateData: UpdateUserInput = {
      id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatarUrl: data.avatarUrl,
    };

    if (data.password) {
      updateData.password_hash = await bcrypt.hash(data.password, 10);
    }

    await this.userRepository.update(id, updateData);
  }
}