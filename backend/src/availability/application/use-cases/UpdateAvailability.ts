import { AvailabilityRepository } from "src/availability/domain/repositories/AvailabilityRepository";

export class UpdateAvaliabilityUseCase {
    constructor(
        private readonly availabilityRepository: AvailabilityRepository
    ) { }

    async execute(id: string, dayOfWeek?: number, startTime?: string, endTime?: string, teacherId?: string): Promise<void> {
        const availability = await this.availabilityRepository.findById(id);
        if (!availability) {
            throw new Error("Avaliação não encontrada.");
        }

        if(dayOfWeek !== undefined) availability.dayOfWeek = dayOfWeek;
        if(startTime !== undefined) availability.startTime = startTime;
        if(endTime !== undefined) availability.endTime = endTime;
        if(teacherId !== undefined) availability.teacherId = teacherId;

        await this.availabilityRepository.update(id, availability);
    }
}