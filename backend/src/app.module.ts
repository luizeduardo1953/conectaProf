import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersController } from './users/controllers/users.controller';
import { UserModule } from './users/user.module';
import { TeachersModule } from './teachers/teachers.module';
import { AgendamentoModule } from './agendamento/agendamento.module';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    TeachersModule,
    AgendamentoModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule { }
