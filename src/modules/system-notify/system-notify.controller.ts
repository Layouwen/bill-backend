import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { created, success } from '../../utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSystemNotifyDto } from './dto/system-notify.dto';
import { SystemNotifyService } from './system-notify.service';

@Controller('system_notify')
@ApiBearerAuth('Token')
@ApiTags('system_notify')
@UseGuards(JwtAuthGuard)
export class SystemNotifyController {
  constructor(private readonly systemNotifyService: SystemNotifyService) {}

  @ApiOperation({ summary: '创建系统通知' })
  @Post()
  async create(
    @Req() req,
    @Body() createSystemNotifyDto: CreateSystemNotifyDto,
  ) {
    await this.systemNotifyService.create(req.user.id, createSystemNotifyDto);
    return created();
  }

  @ApiOperation({ summary: '获取系统通知' })
  @Get()
  async findAll() {
    const data = await this.systemNotifyService.findAll();
    return success(data);
  }
}
