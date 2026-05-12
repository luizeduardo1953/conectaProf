import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role';
import { GetUsers } from 'src/users/application/use-cases/GetUsers';
import { GetUserById } from 'src/users/application/use-cases/GetUserById';
import { DeleteUser } from 'src/users/application/use-cases/DeleteUser';
import { UpdateUser } from 'src/users/application/use-cases/UpdateUser';
import { GetAllTeachersUseCase } from 'src/teachers/application/use-cases/GetAllTeachers';
import { DeleteTeacherUseCase } from 'src/teachers/application/use-cases/DeleteTeacher';
import { SchedulingPrismaRepository } from 'src/scheduling/infra/database/SchedulingPrismaRepository';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Roles(Role.Admin)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly getUsersUseCase: GetUsers,
    private readonly getUserByIdUseCase: GetUserById,
    private readonly deleteUserUseCase: DeleteUser,
    private readonly updateUserUseCase: UpdateUser,
    private readonly getAllTeachersUseCase: GetAllTeachersUseCase,
    private readonly deleteTeacherUseCase: DeleteTeacherUseCase,
    private readonly schedulingRepository: SchedulingPrismaRepository,
  ) {}

  // ── DASHBOARD STATS ──────────────────────────────────────────────
  @Get('stats')
  async getStats() {
    const [users, teachers, schedulings] = await Promise.all([
      this.getUsersUseCase.execute(),
      this.getAllTeachersUseCase.execute(),
      this.schedulingRepository.findAll(),
    ]);

    const students = users.filter((u: any) => u.role === 'student');
    const teacherUsers = users.filter((u: any) => u.role === 'teacher');
    const admins = users.filter((u: any) => u.role === 'admin');

    const allSchedulings = schedulings ?? [];

    return {
      totalUsers: users.length,
      totalStudents: students.length,
      totalTeachers: teacherUsers.length,
      totalAdmins: admins.length,
      totalTeacherProfiles: teachers.length,
      totalSchedulings: allSchedulings.length,
      pendingSchedulings: allSchedulings.filter((s: any) => s.status === 'pending').length,
      confirmedSchedulings: allSchedulings.filter((s: any) => s.status === 'confirmed').length,
    };
  }

  // ── USERS ────────────────────────────────────────────────────────
  @Get('users')
  async listUsers() {
    return this.getUsersUseCase.execute();
  }

  @Get('users/:id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.getUserByIdUseCase.execute(id);
  }

  @Put('users/:id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUserDto,
  ) {
    await this.updateUserUseCase.execute(id, data);
    return this.getUserByIdUseCase.execute(id);
  }

  @Patch('users/:id/role')
  async changeUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('role') role: Role,
  ) {
    await this.updateUserUseCase.execute(id, { role });
    return this.getUserByIdUseCase.execute(id);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteUserUseCase.execute(id);
  }

  // ── TEACHERS ─────────────────────────────────────────────────────
  @Get('teachers')
  async listTeachers() {
    return this.getAllTeachersUseCase.execute();
  }

  @Delete('teachers/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTeacher(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteTeacherUseCase.execute(id);
  }

  // ── SCHEDULINGS ──────────────────────────────────────────────────
  @Get('schedulings')
  async listSchedulings() {
    return this.schedulingRepository.findAll();
  }

  @Get('schedulings/teacher/:teacherId')
  async getSchedulingsByTeacher(@Param('teacherId', ParseUUIDPipe) teacherId: string) {
    return this.schedulingRepository.findByTeacherId(teacherId);
  }

  @Get('schedulings/student/:studentId')
  async getSchedulingsByStudent(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return this.schedulingRepository.findByStudentId(studentId);
  }

  @Delete('schedulings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteScheduling(@Param('id', ParseUUIDPipe) id: string) {
    await this.schedulingRepository.deleteById(id);
  }
}
