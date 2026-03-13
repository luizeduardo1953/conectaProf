import { DisciplineRepository } from "src/discipline/domain/repositories/DisciplineRepository";

export class DeleteDiscipline {
    constructor(private readonly disciplineRepository: DisciplineRepository) {}

    async execute(name: string): Promise<void> {
        const discipline = await this.disciplineRepository.findByName(name);

        if(!discipline) {
            throw new Error("Nenhuma disciplina encontrada!");
        }

        await this.disciplineRepository.delete(name);
    }
}