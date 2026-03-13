export class Discipline {
    constructor(
        public readonly id: string,
        public name: string,
    ) {}

    static create(name: string): Discipline {
        return new Discipline(
            crypto.randomUUID(), 
            name
        );
    }
}

