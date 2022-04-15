import {
  Body,
  Controller,
  Post,
  Request,
  Session,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { fail, success } from '../../utils';
import { AuthService } from './auth.service';
import { LoginDto, SignDto } from './dto/auth.dto';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: '登录',
    description: '登录账号',
  })
  @ApiBody({ type: LoginDto })
  async login(@Request() req, @Body() body: LoginDto, @Session() session) {
    if (session.captcha !== body.captcha.toLowerCase())
      return fail('验证码错误');
    const userInfo = await this.authService.login(req.user.id);
    return success(
      {
        userInfo,
        token: this.jwtService.sign({
          id: req.user.id,
          username: req.user.username,
        }),
      },
      '登录成功',
    );
  }

  @Post('sign')
  @ApiOperation({ summary: '注册' })
  async sign(@Body() signDto: SignDto) {
    const data = await this.authService.sign(signDto);
    return success(data, '注册成功');
  }
}
