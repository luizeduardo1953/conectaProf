import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UserPrismaRepository } from './infra/database/UserPrismaRepository';
// Provavelmente você precisará importar o PrismaModule também, se ele não for global
import { PrismaModule } from '../prisma/prisma.module';
import { UpdateUser } from './application/use-cases/UpdateUser';
import { DeleteUser } from './application/use-cases/DeleteUser';
import { GetUserById } from './application/use-cases/GetUserById';
import { GetUsers } from './application/use-cases/GetUsers';
import { GetUserByEmail } from './application/use-cases/GetUserByEmail';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UserPrismaRepository,
    UpdateUser,
    DeleteUser,
    GetUserById,
    GetUsers,
    GetUserByEmail,
  ],
  exports: [UserPrismaRepository],
})
export class UserModule {}
