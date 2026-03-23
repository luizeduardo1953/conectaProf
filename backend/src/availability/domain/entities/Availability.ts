export interface UpdateAvailabilityInput {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    teacherId?: string;
}

export interface CreateAvailabilityInput {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    teacherId: string;
}

export class Availability {
    constructor(
        public readonly id: string,
        public dayOfWeek: number,
        public startTime: string,
        public endTime: string,
        public teacherId: string,
    ) {}

    static create(dayOfWeek: number, startTime: string, endTime: string, teacherId: string): Availability {
        return new Availability(
            crypto.randomUUID(),
            dayOfWeek,
            startTime,
            endTime,
            teacherId
        );
    }
}