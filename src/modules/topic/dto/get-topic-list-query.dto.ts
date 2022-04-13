import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';
import { QueryDto } from '../../../dto/query.dto';

export class GetTopicListQueryDto extends QueryDto {
  @ApiPropertyOptional({
    description: '是否推荐',
    example: 'false',
  })
  @IsBooleanString({ message: '请输入布尔值' })
  @IsOptional()
  recommend?: boolean;
}
