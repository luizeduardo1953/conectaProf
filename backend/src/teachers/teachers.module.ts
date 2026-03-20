import { Module } from '@nestjs/common';
import { TeachersController } from './controllers/teachers.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../users/user.module';
import { TeacherPrismaRepository } from './infra/database/TeacherPrismaRepository';
import { UpdateTeacherUseCase } from './application/use-cases/UpdateTeacher';
import { DeleteTeacherUseCase } from './application/use-cases/DeleteTeacher';
import { FindTeacherByIdUseCase } from './application/use-cases/FindById';
import { GetAllTeachersUseCase } from './application/use-cases/GetAllTeachers';
import { UserPrismaRepository } from 'src/users/infra/database/UserPrismaRepository';
import { CreateTeacherUseCase } from './application/use-cases/CreateTeacher';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [TeachersController],
  providers: [
    TeacherPrismaRepository,
    UserPrismaRepository,
    UpdateTeacherUseCase,
    DeleteTeacherUseCase,
    FindTeacherByIdUseCase,
    GetAllTeachersUseCase,
    CreateTeacherUseCase,
  ],
})
export class TeachersModule { }
