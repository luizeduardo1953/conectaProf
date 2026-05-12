import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { UploadController } from './upload.controller';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    // Serve arquivos estáticos (avatares) em /uploads/*
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: { index: false },
    }),
    // Configura multer globalmente para o módulo de upload
    MulterModule.register({
      dest: join(process.cwd(), 'uploads', 'avatars'),
    }),
    UserModule,
  ],
  controllers: [UploadController],
})
export class UploadModule {}
