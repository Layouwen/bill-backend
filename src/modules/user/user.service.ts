import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignDto } from '../auth/dto/auth.dto';
import { UpdatePasswordDto, UpdateUserInfoDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
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

  getUserInfo(id: number) {
    return this.usersRepository.findOne(id, {
      select: ['id', 'username', 'name', 'avatar'],
    });
  }

  updateBaseInfo(id: number, updateUserInfoDto: UpdateUserInfoDto) {
    const { name, avatar } = updateUserInfoDto;
    return this.usersRepository.update(id, { name, avatar });
  }

  updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    const { password, newPassword } = updatePasswordDto;
    return this.usersRepository.update(
      { id, password },
      { password: newPassword },
    );
  }
}
