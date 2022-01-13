import { IsNotEmpty } from 'class-validator';

export class AddCategoryDto {
  @IsNotEmpty()
  name: string;
}
