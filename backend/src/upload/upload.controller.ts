import {
  Controller,
  Post,
  Param,
  ParseUUIDPipe,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { UpdateUser } from 'src/users/application/use-cases/UpdateUser';
import { Role } from 'src/enums/role';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

@Controller('upload')
export class UploadController {
  constructor(private readonly updateUser: UpdateUser) {}

  @Post('avatar/:userId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = join(process.cwd(), 'uploads', 'avatars');
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: MAX_SIZE_BYTES },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Apenas imagens JPEG, PNG, WebP ou GIF são aceitas.'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadAvatar(
    @Param('userId', ParseUUIDPipe) userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado.');

    const isOwner = req.user?.sub === userId;
    const isAdmin = req.user?.role === Role.Admin;
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Você não pode alterar o avatar de outro usuário.');
    }

    const relativePath = `/uploads/avatars/${file.filename}`;
    await this.updateUser.execute(userId, { avatarUrl: relativePath });

    return { avatarUrl: relativePath };
  }
}
