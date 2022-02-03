import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entity/user.entity';
import { AuthService } from './auth.service';
import { SignDto } from './dto/auth.dto';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: '登录' })
  login(@Request() req) {
    return this.authService.login(req.user as User);
  }

  @Post('sign')
  @ApiOperation({ summary: '注册' })
  sign(@Body() signDto: SignDto) {
    return this.authService.sign(signDto);
  }
}
