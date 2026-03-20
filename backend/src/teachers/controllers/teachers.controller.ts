import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { DeleteTeacherUseCase } from '../application/use-cases/DeleteTeacher';
import { UpdateTeacherUseCase } from '../application/use-cases/UpdateTeacher';
import { FindTeacherByIdUseCase } from '../application/use-cases/FindById';
import { GetAllTeachersUseCase } from '../application/use-cases/GetAllTeachers';
import { CreateTeacherUseCase } from '../application/use-cases/CreateTeacher';

@Controller('teachers')
export class TeachersController {
  constructor(
    private readonly createTeacher: CreateTeacherUseCase,
    private readonly deleteTeacher: DeleteTeacherUseCase,
    private readonly updateTeacher: UpdateTeacherUseCase,
    private readonly findById: FindTeacherByIdUseCase,
    private readonly getAllTeachers: GetAllTeachersUseCase,
  ) { }

  @Public()
  @Get()
  async getAll() {
    return this.getAllTeachers.execute();
  }

  @Roles(Role.Teacher, Role.Admin)
  @Post()
  async create(@Body() data: CreateTeacherDto, @Req() req) {
    if (data.userId !== req.user.sub && req.user.role !== Role.Admin) {
      throw new ForbiddenException('Você só pode criar o seu próprio perfil de professor.');
    }
    return this.createTeacher.execute(data);
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.findById.execute(id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const teacher = await this.findById.execute(id);
    if (teacher.userId !== req.user.sub && req.user.role !== Role.Admin) {
      throw new ForbiddenException('Você só pode excluir o seu próprio perfil de professor.');
    }
    return this.deleteTeacher.execute(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateTeacherDto,
    @Req() req,
  ) {
    const teacher = await this.findById.execute(id);
    if (teacher.userId !== req.user.sub && req.user.role !== Role.Admin) {
      throw new ForbiddenException('Você só pode editar o seu próprio perfil de professor.');
    }
    return this.updateTeacher.execute(id, data);
  }
}
