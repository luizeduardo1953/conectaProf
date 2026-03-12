import { SchedulingRepository } from "src/scheduling/domain/repositories/SchedulingRepository";

export class FindAll {
    constructor(private readonly schedulingRepository: SchedulingRepository) {}

    async execute() {
        return this.schedulingRepository.findAll();
    }
}