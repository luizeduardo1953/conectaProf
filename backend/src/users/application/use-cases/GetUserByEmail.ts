import { Injectable, NotFoundException } from '@nestjs/common';
import { UserPrismaRepository } from 'src/users/infra/database/UserPrismaRepository';

@Injectable()
export class GetUserByEmail {
  constructor(private readonly userRepository: UserPrismaRepository) {}

  async execute(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return user;
  }
}
