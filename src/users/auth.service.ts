import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);

    if (user.length) {
      throw new BadRequestException('Email already in use');
    }

    const hash = await bcrypt.hash(password, 8);
    console.log(hash);

    return this.usersService.createUser(email, hash);
  }

  async logIn(email: string, password: string) {
    const [user] = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('Invalid Email or Password');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new NotFoundException('Invalid Email or Password');
    }

    return user;
  }
}
