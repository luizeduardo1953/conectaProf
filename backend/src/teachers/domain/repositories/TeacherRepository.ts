import { UpdateTeacherDto } from "src/teachers/dto/update-teacher.dto";
import { Teacher } from "../entities/Teacher";

export interface TeacherRepository {
    create(teacher: Teacher): Promise<Teacher>;
    findById(id: string): Promise<Teacher | null>;
    getAll(): Promise<Teacher[]>;
    delete(id: string): Promise<void>;
    update(id: string, teacher: UpdateTeacherDto): Promise<Teacher>;
}