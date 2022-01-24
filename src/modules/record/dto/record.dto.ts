import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRecordDto {
  @IsNotEmpty()
  remark: string;

  @IsNotEmpty()
  categoryId: string;

  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'date-time' })
  time: Date;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  amount: string;
}

export class SearchRecordListDto {
  startDate?: string;
  endDate?: string;
}
