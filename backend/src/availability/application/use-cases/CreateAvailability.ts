import { CreateAvailabilityDto } from "src/availability/dto/create-availability.dto";
import { AvailabilityRepository } from "src/availability/domain/repositories/AvailabilityRepository";

export class CreateAvailabilityUseCase {
    constructor(
        private readonly availabilityRepository: AvailabilityRepository,
    ) { }

    async execute(data: CreateAvailabilityDto): Promise<void> {
        await this.availabilityRepository.create(data);
    }
}