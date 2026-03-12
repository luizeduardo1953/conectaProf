import { SchedulingRepository } from "src/scheduling/domain/repositories/SchedulingRepository";

export class DeleteByIdScheduling {
    constructor(private schedulingRepository: SchedulingRepository) { }

    async execute(id: string) {
        if (!id) {
            throw new Error('Id is required')
        }

        await this.schedulingRepository.deleteById(id)
    }
}