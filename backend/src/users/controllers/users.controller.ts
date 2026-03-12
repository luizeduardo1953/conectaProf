import {
  Controller,
  Get,
  Post,
  HttpCode,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  Req,
} from '@nestjs/common';
import { UserPrismaRepository } from '../infra/database/UserPrismaRepository';
import { CreateUserDto } from '../dto/create-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role';


@Controller('users')
export class UsersController {
  constructor(private readonly userRepository: UserPrismaRepository) {}

  @Roles(Role.Admin)
  @Get()
  async findAll() {
    return await this.userRepository.findAll();
  }

  @Get('me')
  async findMe(@Req() req) {
    return await this.userRepository.findById(req.user.sub);
  }

  @Roles(Role.Admin)
  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userRepository.findById(id);
  }

  @Roles(Role.Admin)
  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return await this.userRepository.findByEmail(email);
  }

  @Public()
  @Post()
  @HttpCode(201)
  async create(@Body() data: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error('Usuário com esse email já cadastrado.');
    }

    const userData = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      createdAt: new Date(),
    };

    await this.userRepository.save(userData as any);
    return userData;
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userRepository.deleteById(id);
  }

  @Roles(Role.Student, Role.Teacher)
  @Get('teachers')
  async findAllTeachers() {
    return await this.userRepository.findAllTeachers();
  }
}
