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
    console.log(body,'body')
    console.log(session,'session')
    console.log(req,'登录')
    const captcha = body.captcha.toLowerCase();
    if (!captcha || session.captcha !== captcha) return fail('验证码错误');

    const userInfo = await this.authService.login(req.user.id);
    delete session.captcha;

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
  async sign(@Body() signDto: SignDto, @Session() session) {
    const emailCode = signDto.emailCode.toLowerCase();
    if (
      !emailCode ||
      session.emailCode !== emailCode ||
      signDto.email !== session.email
    )
      return fail('验证码错误');

    const data = await this.authService.sign(signDto);
    delete signDto.email;
    delete session.emailCode;

    await this.authService.createDefaultCategory(data.id + '');

    return success(data, '注册成功');
  }
}
