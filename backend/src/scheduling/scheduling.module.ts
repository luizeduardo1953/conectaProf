import { Module } from '@nestjs/common';
import { SchedulingController } from './controllers/scheduling.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SchedulingPrismaRepository } from './infra/database/SchedulingPrismaRepository';

@Module({
    imports: [PrismaModule],
    controllers: [SchedulingController],
    providers: [SchedulingPrismaRepository],
})
export class SchedulingModule { }
