import { Discipline } from "src/discipline/domain/entities/Discipline";
import { DisciplineRepository } from "src/discipline/domain/repositories/DisciplineRepository";

export class GetDisciplineByName {
    constructor(private readonly disciplineRepository: DisciplineRepository) {}

    async execute(name: string): Promise<Discipline> {
        const discipline = await this.disciplineRepository.findByName(name);

        if(!discipline) {
            throw new Error("Nenhuma disciplina encontrada!");
        }

        return discipline;
    }
}