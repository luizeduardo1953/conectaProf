import { SchedulingRepository } from "src/scheduling/domain/repositories/SchedulingRepository";
import { Scheduling } from "src/scheduling/domain/entities/Scheduling";

export class FindByIdScheduling {
    constructor(private schedulingRepository: SchedulingRepository) { }

    async execute(id: string) {
        if (!id) {
            throw new Error("Id is required")
        }

        const scheduling = await this.schedulingRepository.findById(id)

        return scheduling
    }
}