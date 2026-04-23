import { AvailabilityPrismaRepository } from "src/availability/infra/database/AvailabilityPrismaRepository";
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateAvaliabilityUseCase {
    constructor(
        private readonly availabilityRepository: AvailabilityPrismaRepository
    ) { }

    async execute(id: string, dayOfWeek?: number, startTime?: string, endTime?: string, teacherId?: string): Promise<void> {
        const availability = await this.availabilityRepository.findById(id);
        if (!availability) {
            throw new Error("AvaliaÃ§Ã£o nÃ£o encontrada.");
        }

        if(dayOfWeek !== undefined) availability.dayOfWeek = dayOfWeek;
        if(startTime !== undefined) availability.startTime = startTime;
        if(endTime !== undefined) availability.endTime = endTime;
        if(teacherId !== undefined) availability.teacherId = teacherId;

        await this.availabilityRepository.update(id, availability);
    }
}
