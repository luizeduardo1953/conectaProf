import { Module } from '@nestjs/common';

// Provavelmente você precisará importar o PrismaModule também, se ele não for global
import { PrismaModule } from '../prisma/prisma.module';
import { CreateAvailabilityUseCase } from './application/use-cases/CreateAvailability';
import { UpdateAvaliabilityUseCase } from './application/use-cases/UpdateAvailability';
import { DeleteAvailabilityUseCase } from './application/use-cases/DeleteAvailability';
import { FindByIdAvailabilityUseCase } from './application/use-cases/FindByIdAvailability';
import { FindAllAvailabilityUseCase } from './application/use-cases/FindAllAvailability';
import { AvailabilityController } from './controllers/availability.controller';
import { AvailabilityPrismaRepository } from './infra/database/AvailabilityPrismaRepository';

@Module({
  imports: [PrismaModule],
  controllers: [AvailabilityController],
  providers: [
    AvailabilityPrismaRepository,
    CreateAvailabilityUseCase,
    UpdateAvaliabilityUseCase,
    DeleteAvailabilityUseCase,
    FindByIdAvailabilityUseCase,
    FindAllAvailabilityUseCase,
  ],
  exports: [AvailabilityPrismaRepository],
})
export class AvailabilityModule {}
