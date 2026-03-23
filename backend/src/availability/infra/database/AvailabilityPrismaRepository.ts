import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { AvailabilityRepository } from "src/availability/domain/repositories/AvailabilityRepository";
import { Availability, CreateAvailabilityInput, UpdateAvailabilityInput } from "src/availability/domain/entities/Availability";

@Injectable()
export class AvailabilityPrismaRepository implements AvailabilityRepository {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create(data: CreateAvailabilityInput): Promise<void> {
        await this.prisma.availability.create({
            data: {
                dayWeek: data.dayOfWeek,
                timeStart: data.startTime,
                timeEnd: data.endTime,
                teacherId: data.teacherId
            }
        });

    }

    async findById(id: string): Promise<Availability | null> {
        const data = await this.prisma.availability.findUnique({
            where: { id }
        }) as Availability | null;

        return data;
    }

    async findAll(): Promise<Availability[]> {
        const data = await this.prisma.availability.findMany() as [];
        return data;
    }

    async update(id: string, data: UpdateAvailabilityInput): Promise<void> {
        await this.prisma.availability.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.availability.delete({
            where: { id }
        });
    }
}