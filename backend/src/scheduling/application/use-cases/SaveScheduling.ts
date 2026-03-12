import { SchedulingRepository } from "src/scheduling/domain/repositories/SchedulingRepository";
import { Scheduling, SchedulingStatus } from "src/scheduling/domain/entities/Scheduling";

export class SaveScheduling {
    constructor(private schedulingRepository: SchedulingRepository) { }

    async execute(data: {
        studentId: string;
        teacherId: string;
        disciplineId: string;
        dateHourStart: Date;
        dateHourEnd: Date;
        observation: string;
        status: SchedulingStatus;
    }) {

        if (!data.studentId || !data.teacherId || !data.disciplineId || !data.dateHourStart || !data.dateHourEnd || !data.observation || !data.status) {
            throw new Error("All fields are required")
        }

        const scheduling = Scheduling.create(data)

        await this.schedulingRepository.save(scheduling)

        return scheduling
    }
}