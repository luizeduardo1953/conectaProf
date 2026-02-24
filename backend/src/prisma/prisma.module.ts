import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //Torna o módulo disponível
@Module({
  providers: [PrismaService], //Importa o PrismaService
  exports: [PrismaService], //Exporta o PrismaService
})
export class PrismaModule {}
