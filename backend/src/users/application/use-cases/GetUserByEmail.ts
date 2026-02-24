import { UserRepository } from 'src/users/domain/repositories/UserRepository';

export class GetUserByEmail {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    return user;
  }
}
