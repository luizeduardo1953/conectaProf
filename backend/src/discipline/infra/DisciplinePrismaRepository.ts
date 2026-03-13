import { PrismaClient } from "@prisma/client";
import { DisciplineRepository } from "src/discipline/domain/repositories/DisciplineRepository";
import { Discipline } from "src/discipline/domain/entities/Discipline";

export class DisciplinePrismaRepository implements DisciplineRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(name: string): Promise<Discipline> {
        return this.prisma.discipline.create({
            data: {
                name
            }
        });
    }

    async findAll(): Promise<Discipline[]> {
        return this.prisma.discipline.findMany();
    }

    async update(name: string, newName: string): Promise<Discipline> {
        return this.prisma.discipline.update({
            where: {
                name
            },
            data: {
                name: newName
            }
        });
    }

    async delete(name: string): Promise<void> {
        await this.prisma.discipline.delete({
            where: {
                name
            }
        });
    }

    async findByName(name: string): Promise<Discipline | null> {
        return this.prisma.discipline.findUnique({
            where: {
                name
            }
        });
    }
}