import { Body, Controller, HttpCode, HttpStatus } from "@nestjs/common";
import { Discipline } from "../domain/entities/Discipline";
import { DisciplinePrismaRepository } from "../infra/DisciplinePrismaRepository";
import { CreateDisciplineDto } from "../dto/create-discipline.dto";
import { UpdateDisciplineDto } from "../dto/update-discipline.dto";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/enums/role";

import { Post, Get, Put, Delete, Param } from "@nestjs/common";

@Controller('discipline')
export class DisciplineController {
    constructor(private readonly disciplineRepository: DisciplinePrismaRepository) {}

    @HttpCode(201)
    @Post()
    async create(@Body() data: CreateDisciplineDto): Promise<Discipline> {
        return this.disciplineRepository.create(data.name);
    }

    @Roles(Role.Admin)
    @Get()
    async findAll(): Promise<Discipline[]> {
        return this.disciplineRepository.findAll();
    }

    @Roles(Role.Admin)
    @Put()
    async update(@Body() data: UpdateDisciplineDto, newName: string): Promise<Discipline> {
        return this.disciplineRepository.update(data.name, newName);
    }

    @Roles(Role.Admin)
    @Delete(':name')
    async delete(@Param('name') name: string): Promise<void> {
        await this.disciplineRepository.delete(name);
    }

    @Roles(Role.Student, Role.Teacher)
    @Get(':name')
    async findByName(@Param('name') name: string): Promise<Discipline | null> {
        return this.disciplineRepository.findByName(name);
    }
}