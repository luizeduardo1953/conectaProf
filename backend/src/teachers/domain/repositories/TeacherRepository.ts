import { UpdateTeacherInput, Teacher } from '../entities/Teacher';

export interface TeacherRepository {
    create(teacher: Teacher): Promise<Teacher>;
    findById(id: string): Promise<Teacher>;
    getAll(): Promise<Teacher[]>;
    delete(id: string): Promise<void>;
    update(id: string, data: UpdateTeacherInput): Promise<Teacher>;
}
