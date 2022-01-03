import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { LoginUserDto, UpdateUserDto } from './dto/users.dto';
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

  findOne(id: number);
  findOne(where: UpdateUserDto);
  findOne(id: number, where: UpdateUserDto);
  findOne(id: number | LoginUserDto, where?: LoginUserDto): Promise<User> {
    if (id instanceof LoginUserDto) {
      return this.usersRepository.findOne(id);
    }
    if (where) {
      return this.usersRepository.findOne({
        id,
        ...where,
      });
    }
    return this.usersRepository.findOne(id);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  create(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  update(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}
