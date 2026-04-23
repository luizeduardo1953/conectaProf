import { AvailabilityPrismaRepository } from "src/availability/infra/database/AvailabilityPrismaRepository";
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteAvailabilityUseCase {
    constructor(
        private readonly availabilityRepository: AvailabilityPrismaRepository
    ) { }

    async execute(id: string): Promise<void> {
        const availability = await this.availabilityRepository.findById(id);
        if (!availability) {
            throw new Error("AvaliaÃ§Ã£o nÃ£o encontrada.");
        }
        await this.availabilityRepository.delete(id);
    }
}
