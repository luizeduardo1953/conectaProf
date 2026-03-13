import { Discipline } from "../entities/Discipline";

export interface DisciplineRepository {
    create(name: string): Promise<Discipline>;
    findAll(): Promise<Discipline[]>;
    update(name: string, newName: string): Promise<Discipline>;
    delete(name: string): Promise<void>;
    findByName(name: string): Promise<Discipline | null>;
}