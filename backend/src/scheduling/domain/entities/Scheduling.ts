export type SchedulingStatus = 'confirmed' | 'cancelled' | 'completed';

export type CreateSchedulingProps = {
    studentId: string;
    teacherId: string;
    disciplineId: string;
    dateHourStart: Date;
    dateHourEnd: Date;
    observation: string;
    status: SchedulingStatus;
}

export class Scheduling {
    private constructor(
        public readonly id: string,
        public studentId: string,
        public teacherId: string,
        public disciplineId: string,
        public dateHourStart: Date,
        public dateHourEnd: Date,
        public observation: string,
        public status: SchedulingStatus,
        public createdAt: Date,
    ) { }

    static create(props: CreateSchedulingProps) {
        return new Scheduling(
            crypto.randomUUID(),
            props.studentId,
            props.teacherId,
            props.disciplineId,
            props.dateHourStart,
            props.dateHourEnd,
            props.observation,
            props.status,
            new Date(),
        )
    }
}

