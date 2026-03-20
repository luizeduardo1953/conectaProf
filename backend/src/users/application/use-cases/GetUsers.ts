import { Injectable } from '@nestjs/common';
import { UserPrismaRepository } from 'src/users/infra/database/UserPrismaRepository';

@Injectable()
export class GetUsers {
  constructor(private readonly userRepository: UserPrismaRepository) {}

  async execute() {
    const users = await this.userRepository.findAll();
    return users ?? [];
  }
}
