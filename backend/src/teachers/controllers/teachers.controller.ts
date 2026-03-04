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

@Controller('teachers')
export class TeachersController {
    constructor(private readonly prisma: PrismaService) { }

    @Post()
    async createTeacher(@Body() data: CreateTeacherDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            throw new Error('Usuário com email já cadastrado');
        }

        const teacher = await this.prisma.teacher.create({
            data: {
                user: {
                    create: {
                        email: data.email,
                        name: data.name,
                        role: 'teacher',
                        firebaseUid: data.firebaseUid || null,
                    }
                },
                biography: data.biography,
                training: data.training,
                priceHour: Number(data.priceHour || 0),
                telephone: String(data.telephone || '000000000'),
            }
        });

        return teacher;
    }

    @Get()
    async getAllTeachers() {
        return this.prisma.teacher.findMany({
            include: {
                user: true,
                availabilities: true
            }
        });
    }

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
