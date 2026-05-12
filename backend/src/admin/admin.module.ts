import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserModule } from 'src/users/user.module';
import { TeachersModule } from 'src/teachers/teachers.module';
import { SchedulingModule } from 'src/scheduling/scheduling.module';

@Module({
  imports: [UserModule, TeachersModule, SchedulingModule],
  controllers: [AdminController],
})
export class AdminModule {}
