import { Injectable, NotFoundException } from '@nestjs/common';
import { UserPrismaRepository } from 'src/users/infra/database/UserPrismaRepository';

@Injectable()
export class DeleteUser {
  constructor(private readonly userRepository: UserPrismaRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    await this.userRepository.deleteById(userId);
  }
}
