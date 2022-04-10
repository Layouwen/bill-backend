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

  login({ id }: { id: number }) {
    return this.usersService.getUserInfo(id);
  }

  async sign(signDto: SignDto) {
    const { username, password } = signDto;
    const user = await this.usersService.findOne(username);
    if (user) throwFail('用户已存在');
    if (!validateNumber(username)) throwFail('账号必须为数字');
    if (!validatePassword(password)) throwFail('密码必须为8-20位');
    const { id } = await this.usersService.create(signDto);
    return { token: this.jwtService.sign({ username, id }) };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
