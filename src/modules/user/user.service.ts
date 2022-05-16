import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createDefaultCategory } from 'src/utils/createDefaultCategory';
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

  findOne(userId: number) {
    return this.usersRepository.findOne(userId);
  }

  findOneByName(username: string) {
    return this.usersRepository.findOne({
      where: { username },
      select: ['password', 'id', 'username'],
    });
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
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

  createDefaultCategory(userId: string) {
    return this.usersRepository
      .createQueryBuilder()
      .insert()
      .into('category')
      .values(createDefaultCategory(userId))
      .execute();
  }
}
