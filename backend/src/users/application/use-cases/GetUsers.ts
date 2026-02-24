import { UserRepository } from 'src/users/domain/repositories/UserRepository';

export class GetUsers {
  constructor(private userRepository: UserRepository) {}

  async execute() {
    const users = await this.userRepository.findAll();

    if (!users || users.length === 0) {
      return [];
    }

    return users;
  }
}
