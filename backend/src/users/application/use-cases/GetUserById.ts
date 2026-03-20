import { Injectable, NotFoundException } from '@nestjs/common';
import { UserPrismaRepository } from 'src/users/infra/database/UserPrismaRepository';

@Injectable()
export class GetUserById {
  constructor(private readonly userRepository: UserPrismaRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return user;
  }
}
