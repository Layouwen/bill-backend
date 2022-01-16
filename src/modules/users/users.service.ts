import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignDto } from '../auth/dto/auth.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findOne(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  create(user: SignDto): Promise<User> {
    return this.usersRepository.save(user);
  }

  async getUserInfo(userId: number) {
    return await this.usersRepository.findOne(userId, {
      select: ['id', 'username', 'name', 'avatar'],
    });
  }
}
