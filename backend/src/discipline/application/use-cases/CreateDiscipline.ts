import { DisciplineRepository } from "src/discipline/domain/repositories/DisciplineRepository";
import { Discipline } from "src/discipline/domain/entities/Discipline";

export class CreateDiscipline {
    constructor(private readonly disciplineRepository: DisciplineRepository) {}

    async execute(name: string): Promise<Discipline> {

        if(!name) {
            throw new Error("Nome da disciplina é obrigatório");
        }

        const disciplineExists = await this.disciplineRepository.findByName(name);

        if(disciplineExists) {
            throw new Error("Disciplina já cadastrada");
        }

        const discipline = await this.disciplineRepository.create(name);

        return discipline;
    }
}