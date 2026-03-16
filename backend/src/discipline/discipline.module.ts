import { Module } from '@nestjs/common';
import { DisciplinePrismaRepository } from './infra/database/DisciplinePrismaRepository';
import { DisciplineController } from './controllers/discipline.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [DisciplineController],
  providers: [
    DisciplinePrismaRepository,
    PrismaService
  ],
  exports: [DisciplinePrismaRepository],
})
export class DisciplineModule { }
