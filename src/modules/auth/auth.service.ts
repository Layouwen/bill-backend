import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthSuccessResponse, ErrorResponse } from '../../utils';
import { User } from '../users/entity/user.entity';
import { UsersService } from '../users/users.service';
import { SignDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * 登录
   * @param user
   */
  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return new AuthSuccessResponse('登录成功', this.jwtService.sign(payload));
  }

  /**
   * 注册
   * @param signDto
   */
  async sign(signDto: SignDto) {
    const { username } = signDto;
    const user = await this.usersService.findOne(username);
    if (user) {
      return new ErrorResponse('用户已存在');
    }
    const signUser = await this.usersService.create(signDto);
    return new AuthSuccessResponse(
      '注册成功',
      this.jwtService.sign({ username, sub: signUser.id }),
    );
  }

  /**
   * 验证账号是否正确
   * @param username
   * @param password
   */
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
