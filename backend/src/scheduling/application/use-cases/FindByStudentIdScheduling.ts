import { SchedulingRepository } from "src/scheduling/domain/repositories/SchedulingRepository";

export class FindByStudentIdScheduling {
    constructor(private schedulingRepository: SchedulingRepository) { }

    async execute(studentId: string) {
        if (!studentId) {
            throw new Error("Student is required")
        }

        const scheduling = await this.schedulingRepository.findByStudentId(studentId)

        return scheduling
    }
}