import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    ParseUUIDPipe,
    Delete,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role';
import { TeacherPrismaRepository } from '../infra/database/teacherPrismaRepository';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { CreateTeacher } from '../application/use-cases/createTeacher';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';

@Controller('teachers')
export class TeachersController {
    constructor(private readonly prisma: TeacherPrismaRepository,
        private readonly create: CreateTeacher,
    ) { }

    @Public()
    @Get()
    async getAllTeachers() {
        return this.prisma.getAll();
    }

    @Post()
    async createTeacher(@Body() data: CreateTeacherDto) {
        return this.create.execute(data);
    }

    @Get(':id')
    async getTeacher(@Param('id', ParseUUIDPipe) id: string) {
        return this.prisma.findById(id);
    }

    @Delete(':id')
    async deleteTeacher(@Param('id', ParseUUIDPipe) id: string) {
        return this.prisma.delete(id);
    }

    @Put(':id')
    async updateTeacher(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateTeacherDto) {
        return this.prisma.update(id, data);
    }



    


    // @Roles(Role.Teacher)
    // @Post(':userId/availability')
    // async createAvailability(
    //     @Param('userId', ParseUUIDPipe) userId: string,
    //     @Body() dto: CreateAvailabilityDto,
    // ) {
    //     const teacher = await this.prisma.teacher.findUnique({
    //         where: { userId },
    //     });

    //     if (!teacher) {
    //         throw new Error('Teacher Profile not found, please configure it first.');
    //     }

    //     // Convert strings to proper DateTime (since Prisma stores Time, we can mock the Date part)
    //     const baseDate = "1970-01-01T";
    //     const timeStart = new Date(`${baseDate}${dto.timeStart}:00.000Z`);
    //     const timeEnd = new Date(`${baseDate}${dto.timeEnd}:00.000Z`);

    //     const availability = await this.prisma.availability.create({
    //         data: {
    //             teacherId: teacher.id,
    //             dayWeek: dto.dayWeek,
    //             timeStart,
    //             timeEnd,
    //         },
    //     });

    //     return availability;
    // }
}
