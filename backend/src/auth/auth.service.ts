import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPrismaRepository } from 'src/users/infra/database/UserPrismaRepository';
import { User } from 'src/users/domain/entities/User';
import { SignInResponseDto, SignUpRequestDto, SignUpResponseDto, SignInRequestDto } from './auth.dto';
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userPrismaRepository: UserPrismaRepository,
    ) {}

  async signIn(data: SignInRequestDto): Promise<SignInResponseDto> {

    if(data.password.length < 8 || data.password.length > 20) {
      throw new BadRequestException('A senha deve ter entre 8 e 20 caracteres.');
    }
      
    const user = await this.userPrismaRepository.findByEmail(data.email);

    const invalid = new UnauthorizedException('E-mail ou senha incorretos.');

    if (!user) throw invalid;

    const passwordMatch = await bcrypt.compare(data.password, user.password_hash);

    if (!passwordMatch) throw invalid;

    const payload = {
      sub: user.id,
      username: user.name,
      email: user.email,
      role: user.role,
    };

    return {
      token: await this.jwtService.signAsync(payload, { expiresIn: '50m' }),
      expiresIn: '50min',
    };
}

  async signUp(data: SignUpRequestDto): Promise<SignUpResponseDto> {

    const existing = await this.userPrismaRepository.findByEmail(data.email);

    if (existing) {
      throw new ConflictException('Já existe uma conta com este e-mail.');
    }

    if(data.password_hash.length < 8 || data.password_hash.length > 20) {
      throw new BadRequestException('A senha deve ter entre 8 e 20 caracteres.');
    }

    const password_hash = await bcrypt.hash(data.password_hash, 10);

    const newUser = User.create({ name: data.name, email: data.email, password_hash, role: data.role });

    await this.userPrismaRepository.save(newUser);
    
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
  }
    
}