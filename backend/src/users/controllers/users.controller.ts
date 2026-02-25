import {
  Controller,
  Get,
  Post,
  Put,
  HttpCode,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { UserPrismaRepository } from '../infra/database/UserPrismaRepository';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dto/update-user.dto';

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

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUserDto,
  ) {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new Error('Usuário não encontrado.');
    }

    const updatedUserData = {
      ...existingUser, //copia os dados existentes
      name: data.name ?? existingUser.name,
      email: data.email ?? existingUser.email,
      role: data.role ?? existingUser.role,
    };

    if (data.passwordHash) {
      const salt = await bcrypt.genSalt();
      updatedUserData.passwordHash = await bcrypt.hash(data.passwordHash, salt);
    }

    await this.userRepository.save(updatedUserData as any);
    return updatedUserData;
  }
}
