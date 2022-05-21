import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CompatibleCategoryDto {
  @ApiProperty({
    description: '用户id',
    example: 1,
  })
  @IsNumber()
  id: number;
  @ApiProperty({
    description: '密钥',
    example: '1231fadsf1489',
  })
  secretKey: string;
}
