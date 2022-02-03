import { IsNotEmpty } from 'class-validator';

export class SignDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class LoginDto {
  id: number;
  username: string;
}
