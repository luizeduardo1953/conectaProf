import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseUUIDPipe,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAgendamentoDto } from '../dto/create-agendamento.dto';

@Controller('agendamentos')
export class AgendamentoController {
    constructor(private readonly prisma: PrismaService) { }

    @Post()
    async create(@Body() dto: CreateAgendamentoDto) {
        // Check if teacher exists
        const teacher = await this.prisma.teacher.findUnique({
            where: { id: dto.teacherId }
        });
        if (!teacher) throw new Error("Teacher not found");

        const agendamento = await this.prisma.scheduling.create({
            data: {
                studentId: dto.studentId,
                teacherId: dto.teacherId,
                disciplineId: dto.disciplineId,
                dateHourStart: new Date(dto.dateHourStart),
                dateHourEnd: new Date(dto.dateHourEnd),
                observation: dto.observation,
                status: 'Pending',
            }
        });

        return agendamento;
    }

    @Get('teacher/:teacherId')
    async getByTeacher(@Param('teacherId', ParseUUIDPipe) teacherId: string) {
        return this.prisma.scheduling.findMany({
            where: { teacherId },
            include: {
                student: true,
                discipline: true
            }
        });
    }

    @Get('student/:studentId')
    async getByStudent(@Param('studentId', ParseUUIDPipe) studentId: string) {
        return this.prisma.scheduling.findMany({
            where: { studentId },
            include: {
                teacher: {
                    include: { user: true }
                },
                discipline: true
            }
        });
    }
}
