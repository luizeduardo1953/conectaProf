import { Discipline } from "src/discipline/domain/entities/Discipline";
import { DisciplineRepository } from "src/discipline/domain/repositories/DisciplineRepository";

export class GetDisciplines {
    constructor(private readonly disciplineRepository: DisciplineRepository) {}

    async execute(): Promise<Discipline[]> {
        const disciplines = await this.disciplineRepository.findAll();

        if(!disciplines) {
            throw new Error("Nenhuma disciplina encontrada");
        }

        return disciplines;
    }
}