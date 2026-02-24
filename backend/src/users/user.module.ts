import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UserPrismaRepository } from './infra/database/UserPrismaRepository';
// Provavelmente você precisará importar o PrismaModule também, se ele não for global
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UserPrismaRepository,
    // Se você tiver Services ou UseCases, eles vão aqui também
  ],
  exports: [UserPrismaRepository],
})
export class UserModule {}
