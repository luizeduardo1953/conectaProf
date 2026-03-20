import { UpdateUserInput, User } from '../entities/User';

export interface UserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[] | null>;
  deleteById(id: string): Promise<void>;
  update(id: string, data: UpdateUserInput): Promise<void>;
}
