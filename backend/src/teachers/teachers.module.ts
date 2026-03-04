import { Module } from '@nestjs/common';
import { TeachersController } from './controllers/teachers.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [TeachersController],
    providers: [],
})
export class TeachersModule { }
