import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthSuccessResponse,
  ErrorResponse,
  SuccessResponse,
} from '../../utils';
import { UsersService } from '../users/users.service';
import { LoginDto, SignDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login({ id, username }: LoginDto) {
    const userInfo = await this.usersService.findOne(username);
    return new SuccessResponse(
      {
        userInfo,
        token: this.jwtService.sign({ id, username }),
      },
      '登录成功',
    );
  }

  async sign(signDto: SignDto) {
    const { username } = signDto;
    const user = await this.usersService.findOne(username);
    if (user) return new ErrorResponse('用户已存在');
    const { id } = await this.usersService.create(signDto);
    return new AuthSuccessResponse(
      '注册成功',
      this.jwtService.sign({ username, id }),
    );
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
