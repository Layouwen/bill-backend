import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignDto {
  @IsNotEmpty({ message: '请输入用户名' })
  @IsString({ message: '用户名需为字符串' })
  @ApiProperty({
    description: '用户名',
    type: 'string',
    example: '我不是梁同学',
  })
  name: string;

  @IsNotEmpty({ message: '请输入账号' })
  @IsString({ message: '账号需为字符串' })
  @ApiProperty({
    description: '账号',
    type: 'string',
    example: 'layouwen',
  })
  username: string;

  @IsNotEmpty({ message: '请输入密码' })
  @IsString({ message: '密码需为字符串' })
  @ApiProperty({
    description: '密码',
    type: 'string',
    example: 'layouwen',
  })
  password: string;

  @IsNotEmpty({ message: '请输入邮箱' })
  @IsString({ message: '邮箱需为字符串' })
  @ApiProperty({
    description: '邮箱',
    type: 'string',
    example: 'layouwen@gmail.com',
  })
  email: string;

  @IsNotEmpty({ message: '请输入验证码' })
  @IsString({ message: '验证码需为字符串' })
  @ApiProperty({
    description: '邮箱验证码',
    type: 'string',
    example: '33nd',
  })
  emailCode: string;
}

export class LoginDto extends OmitType(SignDto, [
  'name',
  'email',
  'emailCode',
]) {
  @ApiProperty({ description: '验证码', type: 'string', example: '923a' })
  @IsString({ message: '验证码需为字符串' })
  @IsNotEmpty({ message: '请输入验证码' })
  captcha: string;
}
