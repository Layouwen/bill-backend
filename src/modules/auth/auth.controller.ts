import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { User } from '../users/entity/user.entity';
import { AuthService } from './auth.service';
import { SignDto } from './dto/auth.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user as User);
  }

  @Post('sign')
  async sign(@Body() signDto: SignDto) {
    return this.authService.sign(signDto);
  }
}
