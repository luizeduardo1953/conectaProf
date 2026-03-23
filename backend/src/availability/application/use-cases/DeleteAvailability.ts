import { AvailabilityRepository } from "src/availability/domain/repositories/AvailabilityRepository";

export class DeleteAvailabilityUseCase {
    constructor(
        private readonly availabilityRepository: AvailabilityRepository
    ) { }

    async execute(id: string): Promise<void> {
        const availability = await this.availabilityRepository.findById(id);
        if (!availability) {
            throw new Error("Avaliação não encontrada.");
        }
        await this.availabilityRepository.delete(id);
    }
}