import { UserRepository } from 'src/users/domain/repositories/UserRepository';

export class GetUserById {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    return user;
  }
}
