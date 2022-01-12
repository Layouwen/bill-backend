import { IsNotEmpty } from 'class-validator';

export class CreateRecordDto {
  @IsNotEmpty()
  remark: string;

  @IsNotEmpty()
  categoryId: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  amount: string;
}
