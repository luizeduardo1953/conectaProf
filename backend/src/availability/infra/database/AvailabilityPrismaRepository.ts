import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { AvailabilityRepository } from "src/availability/domain/repositories/AvailabilityRepository";
import { Availability, CreateAvailabilityInput, UpdateAvailabilityInput } from "src/availability/domain/entities/Availability";

@Injectable()
export class AvailabilityPrismaRepository implements AvailabilityRepository {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create(data: CreateAvailabilityInput): Promise<Availability> {
        try {
            const created = await this.prisma.availability.create({
                data: {
                    dayWeek: data.dayOfWeek,
                    timeStart: new Date(data.startTime),
                    timeEnd: new Date(data.endTime),
                    teacherId: data.teacherId
                }
            });
            return created as any as Availability;
        } catch (e) {
            console.error('AVAIL_PRISMA_ERROR:', e);
            throw e;
        }
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