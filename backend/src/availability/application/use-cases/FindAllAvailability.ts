import { Availability } from "src/availability/domain/entities/Availability";   
import { AvailabilityPrismaRepository } from "src/availability/infra/database/AvailabilityPrismaRepository";
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAllAvailabilityUseCase {
    constructor(
        private readonly availabilityRepository: AvailabilityPrismaRepository
    ) {}

    async execute(): Promise<Availability[]> {
        return this.availabilityRepository.findAll();
    }
}
