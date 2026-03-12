import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    ParseUUIDPipe,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { CreateAvailabilityDto } from '../dto/availability.dto';
import { CreateTeacherDto } from '../dto/createTeacher.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role';

@Controller('teachers')
export class TeachersController {
    constructor(private readonly prisma: PrismaService) { }

    @Public()
    @Get()
    async getAllTeachers() {
        return this.prisma.teacher.findMany({
            select: {
                id: true,
                biography: true,
                training: true,
                priceHour: true,
                telephone: true,
                availabilities: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        avatarUrl: true,
                    }
                }
            }
        });
    }

    @Public()
    @Get('detail/:id')
    async getTeacherDetail(@Param('id', ParseUUIDPipe) id: string) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { id },
            include: {
                user: true,
                availabilities: true,
                disciplines: {
                    include: {
                        discipline: true,
                    }
                }
            }
        });

        if (!teacher) {
            throw new Error('Professor não encontrado');
        }

        return teacher;
    }


    @Roles(Role.Teacher)
    @Get(':userId')
    async getProfile(@Param('userId', ParseUUIDPipe) userId: string) {
        let teacher = await this.prisma.teacher.findUnique({
            where: { userId },
            include: {
                availabilities: true,
            },
        });

        return teacher;
    }

    @Roles(Role.Teacher)
    @Put(':userId')
    async upsertProfile(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Body() dto: UpdateTeacherDto,
    ) {
        const teacher = await this.prisma.teacher.upsert({
            where: { userId },
            update: {
                biography: dto.biography,
                training: dto.training,
                priceHour: dto.priceHour,
                telephone: dto.telephone || '000000000',
            },
            create: {
                userId,
                biography: dto.biography,
                training: dto.training,
                priceHour: dto.priceHour || 0,
                telephone: dto.telephone || '000000000',
            },
        });
        return teacher;
    }

    @Roles(Role.Teacher)
    @Post(':userId/availability')
    async createAvailability(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Body() dto: CreateAvailabilityDto,
    ) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { userId },
        });

        if (!teacher) {
            throw new Error('Teacher Profile not found, please configure it first.');
        }

        // Convert strings to proper DateTime (since Prisma stores Time, we can mock the Date part)
        const baseDate = "1970-01-01T";
        const timeStart = new Date(`${baseDate}${dto.timeStart}:00.000Z`);
        const timeEnd = new Date(`${baseDate}${dto.timeEnd}:00.000Z`);

        const availability = await this.prisma.availability.create({
            data: {
                teacherId: teacher.id,
                dayWeek: dto.dayWeek,
                timeStart,
                timeEnd,
            },
        });

        return availability;
    }
}
