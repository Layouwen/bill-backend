import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SuccessResponse } from '../../utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('userInfo')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req) {
    const res = await this.usersService.getUserInfo(req.user.id);
    return new SuccessResponse(res);
  }
}
