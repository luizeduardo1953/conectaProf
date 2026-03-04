import { Module } from '@nestjs/common';
import { AgendamentoController } from './controllers/agendamento.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AgendamentoController],
    providers: [],
})
export class AgendamentoModule { }
