import { Availability, CreateAvailabilityInput, UpdateAvailabilityInput } from "../entities/Availability";

export interface AvailabilityRepository {
    create(data: CreateAvailabilityInput): Promise<void>;
    update(id: string, data: UpdateAvailabilityInput): Promise<void>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<Availability | null>;
    findAll(): Promise<Availability[]>;
}