export class CreateAvailabilityDto {
    dayWeek: number; // 0 = Sunday, 1 = Monday, etc.
    timeStart: string; // "08:00"
    timeEnd: string; // "12:00"
}
