import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class ToolsService {
  svgCaptcha() {
    return svgCaptcha.create();
  }
}
