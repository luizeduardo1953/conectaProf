import { Injectable } from "@nestjs/common";
import { SchedulingRepository } from "src/scheduling/domain/repositories/SchedulingRepository";
import { PrismaService } from "src/prisma/prisma.service";
import { Scheduling } from "src/scheduling/domain/entities/Scheduling";
import { SchedulingStatus as PrismaStatus } from "@prisma/client";

@Injectable()
export class SchedulingPrismaRepository implements SchedulingRepository {
    constructor(private prisma: PrismaService) { }

    async save(scheduling: Scheduling): Promise<void> {
        // Mapeamento do status do Domínio (string) para o Enum do Prisma
        let prismaStatus: PrismaStatus = PrismaStatus.Pending;
        if (scheduling.status === 'confirmed') prismaStatus = PrismaStatus.Confirmed;
        if (scheduling.status === 'cancelled') prismaStatus = PrismaStatus.Canceled;
        if (scheduling.status === 'completed') prismaStatus = PrismaStatus.Completed;

        await this.prisma.scheduling.upsert({
            where: { id: scheduling.id },
            update: {
                studentId: scheduling.studentId,
                teacherId: scheduling.teacherId,
                disciplineId: scheduling.disciplineId,
                dateHourStart: scheduling.dateHourStart,
                dateHourEnd: scheduling.dateHourEnd,
                observation: scheduling.observation,
                status: prismaStatus,
            },
            create: {
                id: scheduling.id,
                studentId: scheduling.studentId,
                teacherId: scheduling.teacherId,
                disciplineId: scheduling.disciplineId,
                dateHourStart: scheduling.dateHourStart,
                dateHourEnd: scheduling.dateHourEnd,
                observation: scheduling.observation,
                status: prismaStatus,
            },
        });
    }

    async findAll(): Promise<Scheduling[] | null> {
        const data = await this.prisma.scheduling.findMany();
        return data as unknown as Scheduling[] | null;
    }

    async findById(id: string): Promise<Scheduling | null> {
        const data = await this.prisma.scheduling.findUnique({
            where: { id },
        });
        return data as unknown as Scheduling | null;
    }

    async findByStudentId(studentId: string): Promise<Scheduling[] | null> {
        const data = await this.prisma.scheduling.findMany({
            where: { studentId },
        });
        return data as unknown as Scheduling[] | null;
    }

    async findByTeacherId(teacherId: string): Promise<Scheduling[] | null> {
        const data = await this.prisma.scheduling.findMany({
            where: { teacherId },
        });
        return data as unknown as Scheduling[] | null;
    }

    async findByDisciplineId(disciplineId: string): Promise<Scheduling[] | null> {
        const data = await this.prisma.scheduling.findMany({
            where: { disciplineId },
        });
        return data as unknown as Scheduling[] | null;
    }

    async deleteById(id: string): Promise<void> {
        await this.prisma.scheduling.delete({
            where: { id },
        });
    }


}