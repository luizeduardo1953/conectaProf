import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPrismaRepository } from 'src/users/infra/database/UserPrismaRepository';
import { User } from 'src/users/domain/entities/User';
import { AuthResponseDto } from './auth.dto';
import { Role } from 'src/enums/role';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userPrismaRepository: UserPrismaRepository,
    ) {}

  async signIn(email: string, pass: string): Promise<AuthResponseDto> {
  const user = await this.userPrismaRepository.findByEmail(email);

  const invalid = new UnauthorizedException('E-mail ou senha incorretos.');

  if (!user) throw invalid;

  const passwordMatch = await bcrypt.compare(pass, user.password_hash);

  if (!passwordMatch) throw invalid;

  const payload = {
    sub: user.id,
    username: user.name,
    email: user.email,
    role: user.role,
  };

  return {
    token: await this.jwtService.signAsync(payload),
    expireIn: '50min',
  };
}

  async signUp(name: string, email: string, password: string, role: Role): Promise<AuthResponseDto> {
    const existing = await this.userPrismaRepository.findByEmail(email);
    if (existing) {
      throw new ConflictException('Já existe uma conta com este e-mail.');
    }

      const password_hash = await bcrypt.hash(password, 10);

    const newUser = User.create({ name, email, password_hash, role });

    await this.userPrismaRepository.save(newUser);

    const payload = { sub: newUser.id, username: newUser.name, email: newUser.email, password_hash: newUser.password_hash, role: newUser.role };
    
    return {
      token: await this.jwtService.signAsync(payload),
      expireIn: '50min',
    };
  }
    
}