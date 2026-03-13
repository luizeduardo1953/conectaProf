import { Controller } from "@nestjs/common";
import { DisciplineRepository } from "../domain/repositories/DisciplineRepository";
import { Discipline } from "../domain/entities/Discipline";
import { DisciplinePrismaRepository } from "../infra/DisciplinePrismaRepository";

import { Post, Get, Put, Delete } from "@nestjs/common";

@Controller('discipline')
export class DisciplineController {
    constructor(private readonly disciplineRepository: DisciplinePrismaRepository) {}

    @Post()
    async create(name: string): Promise<Discipline> {
        return this.disciplineRepository.create(name);
    }

    @Get()
    async findAll(): Promise<Discipline[]> {
        return this.disciplineRepository.findAll();
    }

    @Put()
    async update(name: string, newName: string): Promise<Discipline> {
        return this.disciplineRepository.update(name, newName);
    }

    @Delete()
    async delete(name: string): Promise<void> {
        await this.disciplineRepository.delete(name);
    }

    @Get()
    async findByName(name: string): Promise<Discipline | null> {
        return this.disciplineRepository.findByName(name);
    }
}