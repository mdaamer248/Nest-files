import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Session,
  UseGuards,
} from '@nestjs/common';
import { identity } from 'rxjs';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from './interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/users.entity';
import { AuthGuard } from './guards/auth.guard';

@Serialize(UserDto)
@Controller('users')
export class UsersController {
  constructor(
    private service: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signIn')
  async loginUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.logIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @UseGuards(AuthGuard)
  @Post('/signOut')
  async signOutUser(@Session() session: any) {
    session.userId = null;
  }

  @UseGuards(AuthGuard)
  @Get('/whoAmI')
  async getMe(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findUser(@Param('id') id: string, @Session() session: any) {
    return this.service.findUserById(parseInt(id));
  }

  @UseGuards(AuthGuard)
  @Patch('update/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.service.updateUser(parseInt(id), body);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return this.service.removeUser(parseInt(id));
  }
}
