import { CreateAvailabilityDto } from "src/availability/dto/create-availability.dto";
import { AvailabilityPrismaRepository } from "src/availability/infra/database/AvailabilityPrismaRepository";
import { Injectable } from '@nestjs/common';
import { Availability } from "src/availability/domain/entities/Availability";

@Injectable()
export class CreateAvailabilityUseCase {
    constructor(
        private readonly availabilityRepository: AvailabilityPrismaRepository,
    ) { }

    async execute(data: CreateAvailabilityDto): Promise<Availability> {
        return await this.availabilityRepository.create(data);
    }
}