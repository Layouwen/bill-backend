import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class GetEmailCaptchaDto {
  @ApiProperty({
    description: '邮箱',
    example: 'layouwen@gmail.com',
  })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;
}
