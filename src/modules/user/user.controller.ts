import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { success, updated, fail } from '../../utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckInService } from '../check-in/check-in.service';
import { RecordService } from '../record/record.service';
import { UpdatePasswordDto, UpdateUserInfoDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth('Token')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly checkInService: CheckInService,
    private readonly recordService: RecordService,
  ) {}

  @Get('userInfo')
  @ApiOperation({ summary: '获取用户信息' })
  async getUserInfo(@Req() req) {
    // base info
    const userInfo = await this.usersService.getUserInfo(req.user.id);

    // check in info
    const checkIn = !!(await this.checkInService.hasCheckIn(req.user.id));

    // check day count
    const { checkInAll, checkInKeep } =
      await this.checkInService.getCheckInInfo(req.user.id);

    // record quantity
    const { total } = await this.recordService.findAll(req.user.id);

    // bill record
    const billRecord = await this.recordService.getBillRecord(req.user.id);
    return success({
      ...userInfo,
      checkIn,
      checkInAll,
      checkInKeep,
      billRecord,
      recordCount: total || 0,
    });
  }

  @Put('userInfo')
  @ApiOperation({ summary: '更新用户信息' })
  async updateUserInfo(
    @Req() req,
    @Body() updateUserInfoDto: UpdateUserInfoDto,
  ) {
    await this.usersService.updateBaseInfo(req.user.id, updateUserInfoDto);
    return updated();
  }

  @Put('password')
  @ApiOperation({ summary: '更新密码' })
  async updatePassword(
    @Req() req,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const { affected } = await this.usersService.updatePassword(
      req.user.id,
      updatePasswordDto,
    );
    if (affected) return updated();
    return fail('旧密码错误');
  }
}
