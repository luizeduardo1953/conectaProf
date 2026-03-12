import { SchedulingRepository } from "src/scheduling/domain/repositories/SchedulingRepository";

export class FindByDisciplineScheduling {
    constructor(private schedulingRepository: SchedulingRepository) { }

    async execute(disciplineId: string) {
        if (!disciplineId) {
            throw new Error("Discipline is required")
        }

        const scheduling = await this.schedulingRepository.findByDisciplineId(disciplineId)

        return scheduling
    }
}