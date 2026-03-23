import { Availability } from "src/availability/domain/entities/Availability";   
import { AvailabilityRepository } from "src/availability/domain/repositories/AvailabilityRepository";

export class FindAllAvailabilityUseCase {
    constructor(
        private readonly availabilityRepository: AvailabilityRepository
    ) {}

    async execute(): Promise<Availability[]> {
        return this.availabilityRepository.findAll();
    }
}