import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class QueryDto {
  @ApiPropertyOptional({
    description: '当前页数',
    example: 1,
  })
  @IsNumberString({ message: '请输入数字' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: '每页数量',
    example: 10,
  })
  @IsNumberString({ message: '请输入数字' })
  @IsOptional()
  pageSize?: number;
}
