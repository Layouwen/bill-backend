import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRecordDto {
  @IsNotEmpty()
  @IsString({ message: '请输入备注' })
  @ApiProperty({ description: '备注', example: '买衣服' })
  remark: string;

  @IsNotEmpty()
  @IsNumberString({ message: '请输入金额' })
  @ApiProperty({ description: '分类id', example: '4' })
  categoryId: string;

  @IsNotEmpty()
  @IsDateString({ message: '请选择日期' })
  @ApiProperty({ type: 'string', format: 'date-time', description: '记账时间' })
  time: string;

  @IsNotEmpty()
  @IsEnum(['-', '+'], { message: '请选择类型' })
  @ApiProperty({
    type: 'enum',
    enum: ['+', '-'],
    example: '+',
    description: '记账类型',
  })
  type: string;

  @IsNotEmpty()
  @IsString({ message: '请输入金额' })
  @ApiProperty({ example: '1000', description: '金额' })
  amount: string;
}

export class UpdateRecordDto extends PartialType(CreateRecordDto) {}

export class SearchRecordListDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '2022-2-4', description: '开始时间' })
  startDate?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '2022-4-3', description: '结束时间' })
  endDate?: string;
}
