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
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { CreateSchedulingDto } from "../dto/create-scheduling.dto";
import { SchedulingPrismaRepository } from '../infra/database/SchedulingPrismaRepository';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role';

@Controller('scheduling')
export class SchedulingController {
    constructor(private readonly schedulingRepository: SchedulingPrismaRepository) { }

    @Roles(Role.Student)
    @Post()
    @HttpCode(201)
    async create(@Req() req, @Body() data: CreateSchedulingDto) {

        const scheduling = {
            id: crypto.randomUUID(),
            teacherId: data.teacherId,
            studentId: req.user.sub,
            disciplineId: data.disciplineId,
            dateHourStart: new Date(data.dateHourStart),
            dateHourEnd: new Date(data.dateHourEnd),
            observation: data.observation ?? '',
            status: 'pending' as any,
            createdAt: new Date(),
        }

        return this.schedulingRepository.save(scheduling as any);
    }

    //Admin vê todas as aulas
    @Roles(Role.Admin)
    @Get()
    async findAll() {
        return this.schedulingRepository.findAll();
    }

    //Professor vê suas aulas (busca pelo teacherId via userId do JWT)
    @Roles(Role.Teacher)
    @Get('my-classes')
    async findMyTeacherScheduling(@Req() req) {
        // O JWT tem sub = userId, precisamos buscar o teacher pelo userId
        return this.schedulingRepository.findByTeacherUserId(req.user.sub);
    }

    // Estudante vê apenas seus próprios agendamentos (pelo token)
    @Roles(Role.Student)
    @Get('my-scheduling')
    findMyStudentScheduling(@Req() req) {
        return this.schedulingRepository.findByStudentId(req.user.sub);
    }

    //Admin vê todas as aulas de um professor
    @Roles(Role.Admin)
    @Get('teacher/:id')
    async findByTeacherId(@Param('id', ParseUUIDPipe) id: string) {
        return this.schedulingRepository.findByTeacherId(id);
    }

    //Admin vê todas as aulas de um estudante
    @Roles(Role.Admin)
    @Get('student/:id')
    async findByStudentId(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
        return this.schedulingRepository.findByStudentId(id);
    }

    //Admin vê todas as aulas de uma disciplina
    @Roles(Role.Admin)
    @Get('discipline/:id')
    async findByDisciplineId(@Param('id', ParseUUIDPipe) id: string) {
        return this.schedulingRepository.findByDisciplineId(id);
    }

    //Admin vê uma aula específica
    @Roles(Role.Admin)
    @Get(':id')
    async findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.schedulingRepository.findById(id);
    }

    //Admin, estudante e professor deletam uma aula
    @Roles(Role.Admin, Role.Student, Role.Teacher)
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
        const scheduling =  await this.schedulingRepository.findById(id);

        if(!scheduling) {
            throw new NotFoundException('Agendamento não encontrado.');        
        }

        if(scheduling.studentId !== req.user.sub && scheduling.teacherId !== req.user.sub && req.user.role !== Role.Admin) {
            throw new ForbiddenException('Você não tem permissão para deletar este agendamento.')
        }

        return this.schedulingRepository.deleteById(id);
    }

}