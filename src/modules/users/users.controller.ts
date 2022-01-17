import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ErrorResponse, SuccessResponse } from '../../utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdatePasswordDto, UpdateUserInfoDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('userInfo')
  async getUserInfo(@Req() req) {
    const res = await this.usersService.getUserInfo(req.user.id);
    return new SuccessResponse(res);
  }

  @Put('userInfo')
  async updateUserInfo(
    @Req() req,
    @Body() updateUserInfoDto: UpdateUserInfoDto,
  ) {
    await this.usersService.updateAvatar(req.user.id, updateUserInfoDto);
    return new SuccessResponse('更新成功');
  }

  @Put('password')
  async updatePassword(
    @Req() req,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const { affected } = await this.usersService.updatePassword(
      req.user.id,
      updatePasswordDto,
    );
    if (affected) return new SuccessResponse('更新密码成功');
    return new ErrorResponse('旧密码错误');
  }
}
