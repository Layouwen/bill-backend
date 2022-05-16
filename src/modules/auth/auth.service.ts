import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { throwFail, validateNumber, validatePassword } from '../../utils';
import { UserService } from '../user/user.service';
import { SignDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  login(id: number) {
    return this.usersService.getUserInfo(id);
  }

  async sign(signDto: SignDto) {
    const { username, password, email } = signDto;
    const userEntry = await this.usersService.findOneByName(username);
    if (userEntry) throwFail('账号已经注册');
    const emailEntry = await this.usersService.findOneByEmail(email);
    if (emailEntry) throwFail('邮箱已经注册');

    if (!validateNumber(username)) throwFail('账号必须为数字');
    if (!validatePassword(password)) throwFail('密码必须为8-20位');

    const { id } = await this.usersService.create(signDto);
    return { token: this.jwtService.sign({ username, id }), id };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByName(username);
    if (user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async createDefaultCategory(userId: string) {
    return this.usersService.createDefaultCategory(userId);
  }
}
