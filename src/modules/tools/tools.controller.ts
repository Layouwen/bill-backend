import { Controller, Get, Query, Res, Session } from '@nestjs/common';
import { ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { fail, success } from '../../utils';
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

  @ApiOperation({ summary: '获取邮箱验证码' })
  @Get('email')
  async emailCaptcha(@Session() session, @Query('email') email: string) {
    const captcha = this.toolsService.svgCaptcha();
    const emailCode = captcha.text.toLowerCase();
    session.emailCode = emailCode;
    session.email = email;
    const hasSend = await this.toolsService.emailCaptcha({
      email,
      text: emailCode,
      html: `<h1>${emailCode}</h1>`,
    });
    if (hasSend) {
      return success('邮件发送成功');
    } else {
      return fail('邮件发送失败');
    }
  }
}
