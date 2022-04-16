import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { QueryDto } from '../../../dto/query.dto';

export class CreateRecordDto {
  @IsNotEmpty({ message: '备注不能为空' })
  @IsString({ message: '备注必须为字符串' })
  @ApiProperty({ description: '备注', example: '买衣服' })
  remark: string;

  @IsNotEmpty({ message: '分类不能为空' })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    { message: '分类必须为数字' },
  )
  @ApiProperty({ description: '分类id', example: '4' })
  categoryId: string;

  @IsNotEmpty({ message: '日期不能为空' })
  @IsDateString({ message: '请选择日期' })
  @ApiProperty({ type: 'string', format: 'date-time', description: '记账时间' })
  time: string;

  @IsNotEmpty({ message: '类型不能为空' })
  @IsEnum(['-', '+'], { message: '请选择类型' })
  @ApiProperty({
    type: 'enum',
    enum: ['+', '-'],
    example: '+',
    description: '记账类型',
  })
  type: string;

  @IsNotEmpty({ message: '金额不能为空' })
  @IsString({ message: '金额必须为字符串' })
  @ApiProperty({ example: '1000', description: '金额' })
  amount: string;
}

export class UpdateRecordDto extends PartialType(CreateRecordDto) {}

export class SearchRecordListDto extends QueryDto {
  @IsString({ message: '开始时间必须是字符串' })
  @IsOptional()
  @ApiPropertyOptional({ example: '2022-2-4', description: '开始时间' })
  startDate?: string;

  @IsString({ message: '结束时间必须是字符串' })
  @IsOptional()
  @ApiPropertyOptional({ example: '2022-4-3', description: '结束时间' })
  endDate?: string;
}
