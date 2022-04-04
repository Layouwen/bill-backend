import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '用户名',
    type: 'string',
    example: '我不是梁同学',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '账号',
    type: 'string',
    example: 'layouwen',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '密码',
    type: 'string',
    example: 'layouwen',
  })
  password: string;
}

export class LoginDto extends OmitType(SignDto, ['name']) {}
