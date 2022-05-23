import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '分类1',
  })
  @IsString()
  name: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @ApiPropertyOptional({ example: '图标' })
  icon?: string;
}

export class GetCategoryDto {
  @ApiPropertyOptional({
    example: '-',
    enum: ['-', '+'],
  })
  @IsOptional()
  @IsString()
  type?: string;
}
