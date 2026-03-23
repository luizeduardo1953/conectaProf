import { Availability } from "src/availability/domain/entities/Availability";
import { AvailabilityRepository } from "src/availability/domain/repositories/AvailabilityRepository";

export class FindByIdAvailabilityUseCase {
    constructor(
        private readonly availabilityRepository: AvailabilityRepository,
    ) { }

    async execute(id: string): Promise<Availability | null> {
        return this.availabilityRepository.findById(id);
    }
}