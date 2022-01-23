import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddCategoryDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '分类1',
  })
  name: string;
}
