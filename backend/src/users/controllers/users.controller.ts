import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Delete,
  Req,
  Put,
  Body,
  ForbiddenException,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role';
import { DeleteUser } from '../application/use-cases/DeleteUser';
import { GetUserById } from '../application/use-cases/GetUserById';
import { GetUsers } from '../application/use-cases/GetUsers';
import { GetUserByEmail } from '../application/use-cases/GetUserByEmail';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateUser } from '../application/use-cases/UpdateUser';


@Controller('users')
export class UsersController {
  constructor(
    private readonly deleteUser: DeleteUser,
    private readonly getUsers: GetUsers,
    private readonly getUserById: GetUserById,
    private readonly getUserByEmail: GetUserByEmail,
    private readonly updateUser: UpdateUser,
  ) {}

  @Roles(Role.Admin)
  @Get()
  async findAllUsers() {
    return await this.getUsers.execute();
  }

  @Get('me')
  async findMe(@Req() req) {
    return await this.getUserById.execute(req.user.sub);
  }

  @Roles(Role.Admin)
  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return await this.getUserByEmail.execute(email);
  }

  @Roles(Role.Admin)
  @Get(':id')
  async findByIdUsers(@Param('id', ParseUUIDPipe) id: string) {
    return await this.getUserById.execute(id);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.deleteUser.execute(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUserDto,
    @Req() req,
  ) {
    const isOwner = req.user.sub === id;
    const isAdmin = req.user.role === Role.Admin;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Você só pode editar o seu próprio perfil.');
    }

    return await this.updateUser.execute(id, data);
  }
}
