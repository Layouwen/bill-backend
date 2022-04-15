import { Controller, Get, Res, Session } from '@nestjs/common';
import { ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ToolsService } from './tools.service';

@ApiTags('tools')
@Controller('tools')
export class ToolsController {
  constructor(private toolsService: ToolsService) {}

  @ApiOperation({ summary: '获取图片验证码' })
  @Get('captcha')
  @ApiProduces('image/svg+xml')
  svgCaptcha(
    @Res({ passthrough: true }) res: Response,
    @Session() session: Record<string, any>,
  ) {
    const captcha = this.toolsService.svgCaptcha();
    session.captcha = captcha.text.toLowerCase();
    res.type('svg');
    return captcha.data;
  }
}
