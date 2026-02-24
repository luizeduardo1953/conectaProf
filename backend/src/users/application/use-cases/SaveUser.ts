import { UserRole } from 'src/users/domain/entities/User';
import { UserRepository } from 'src/users/domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';

export class SaveUser {
  constructor(private userRepository: UserRepository) {}

  async execute(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
  }) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error('Usuário com esse email já cadastrado.');
    }

    const user = User.create(data);

    await this.userRepository.save(user);

    return user;
  }
}
