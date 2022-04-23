import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateSystemNotifyDto {
  @ApiProperty({
    description: '消息的内容',
  })
  @IsString({ message: '内容必须为字符串' })
  @IsNotEmpty({ message: '内容不能为空' })
  content: string;

  @ApiPropertyOptional({
    description: '是否全局通知',
    default: false,
  })
  @IsBoolean({ message: '类型必须为布尔值' })
  @IsOptional()
  isGlobal?: boolean;

  @ApiPropertyOptional({ description: '封面图片', default: '' })
  @IsOptional()
  @IsUrl({ message: '图片必须为url' })
  coverPicture?: string;
}
