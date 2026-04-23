import { Availability } from "src/availability/domain/entities/Availability";
import { AvailabilityPrismaRepository } from "src/availability/infra/database/AvailabilityPrismaRepository";
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindByIdAvailabilityUseCase {
    constructor(
        private readonly availabilityRepository: AvailabilityPrismaRepository,
    ) { }

    async execute(id: string): Promise<Availability | null> {
        return this.availabilityRepository.findById(id);
    }
}
