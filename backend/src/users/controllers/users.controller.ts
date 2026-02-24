import {
  Controller,
  Get,
  Post,
  HttpCode,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { UserPrismaRepository } from '../infra/database/UserPrismaRepository';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly userRepository: UserPrismaRepository) {}

  @Get()
  async findAll() {
    return await this.userRepository.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userRepository.findById(id);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return await this.userRepository.findByEmail(email);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() data: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error('Usuário com esse email já cadastrado.');
    }

    if (!data.passwordHash) {
      throw new Error('Senha não informada.');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(data.passwordHash, salt);

    const userData = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
      createdAt: new Date(),
    };

    await this.userRepository.save(userData as any);
    return userData;
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userRepository.deleteById(id);
  }
}
