import { Scheduling } from "../entities/Scheduling";


export interface SchedulingRepository {
    save(scheduling: Scheduling): Promise<void>;
    findById(id: string): Promise<Scheduling | null>;
    findByStudentId(studentId: string): Promise<Scheduling[] | null>;
    findByTeacherId(teacherId: string): Promise<Scheduling[] | null>;
    findByDisciplineId(disciplineId: string): Promise<Scheduling[] | null>;
    deleteById(id: string): Promise<void>;
    findAll(): Promise<Scheduling[] | null>;
}