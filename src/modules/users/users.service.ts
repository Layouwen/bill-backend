import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignDto } from '../auth/dto/auth.dto';
import { UpdatePasswordDto, UpdateUserInfoDto } from './dto/users.dto';
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

  async getUserInfo(id: number) {
    return await this.usersRepository.findOne(id, {
      select: ['id', 'username', 'name', 'avatar'],
    });
  }

  async updateAvatar(id: number, updateUserInfoDto: UpdateUserInfoDto) {
    const { name, avatar } = updateUserInfoDto;
    return await this.usersRepository.update(id, { name, avatar });
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    const { password, newPassword } = updatePasswordDto;
    return await this.usersRepository.update(
      { id, password },
      { password: newPassword },
    );
  }
}
