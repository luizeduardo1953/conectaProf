import { SchedulingRepository } from "src/scheduling/domain/repositories/SchedulingRepository";

export class FindByTeacherIdScheduling {
    constructor(private schedulingRepository: SchedulingRepository) { }

    async execute(teacherId: string) {
        if (!teacherId) {
            throw new Error("Teacher is required")
        }

        const scheduling = await this.schedulingRepository.findByTeacherId(teacherId)

        return scheduling
    }
}