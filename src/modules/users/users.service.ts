import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { SignDto } from '../auth/dto/auth.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(username: string) {
    return this.usersRepository.findOne({ username });
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  create(user: SignDto): Promise<User> {
    return this.usersRepository.save(user);
  }

  update(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}
