import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import * as nodemailer from 'nodemailer';
import config from '../../config';

@Injectable()
export class ToolsService {
  svgCaptcha() {
    return svgCaptcha.create();
  }

  async emailCaptcha({
    email,
    subject = '蓝鲸记账 ✔',
    text,
    html,
  }: EmailCaptchaType) {
    const transporter = nodemailer.createTransport({
      service: '126',
      secureConnection: true,
      auth: {
        user: 'layouwen@126.com',
        pass: config.emailPassword,
      },
    });
    try {
      await transporter.sendMail({
        from: 'layouwen@126.com',
        to: email,
        subject,
        text,
        html,
      });
      return true;
    } catch (err) {
      console.log(err, 'error');
      return false;
    }
  }
}

type EmailCaptchaType = {
  email: string;
  subject?: string;
  text: string;
  html: string;
};
