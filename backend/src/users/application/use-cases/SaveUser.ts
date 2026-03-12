import { UserRepository } from 'src/users/domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { Role } from 'src/enums/role';

export class SaveUser {
  constructor(private userRepository: UserRepository) {}

  async execute(data: {
    name: string;
    email: string;
    password_hash: string;
    role: Role;
    avatarUrl?: string;
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
