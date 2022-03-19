import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  createUser(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  async findUserById(id: number) {
    const user = await this.repo.findOne(id);

    if (!user) {
      throw new NotFoundException('User not Found');
    }

    return user;
  }

  findUserByEmail(email: string) {
    return this.repo.find({ email });
  }

  async updateUser(id: number, attr: Partial<User>) {
    const user = await this.repo.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, attr);
    return this.repo.save(user);
  }

  async removeUser(id: number) {
    const user = await this.repo.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repo.remove(user);
  }
}
