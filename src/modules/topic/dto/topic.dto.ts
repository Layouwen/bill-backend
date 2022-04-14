import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTopicDto {
  @IsNotEmpty()
  content: string;

  @IsArray()
  images: string[];
}

export class getTopicDetailDto {
  @IsNotEmpty()
  @IsNumberString()
  id: string;
}

export class AddCommentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '评论内容' })
  content: string;

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({ description: '回复评论id', example: '1' })
  replyTo?: string;
}
