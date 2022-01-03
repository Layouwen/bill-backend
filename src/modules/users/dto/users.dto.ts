class BaseUserDto {
  username?: string;
  password?: string;
}

export class CreateUserDto extends BaseUserDto {
  name?: string;
}

export class LoginUserDto extends BaseUserDto {}

export class DeleteUserDto extends BaseUserDto {}

export class UpdateUserDto extends CreateUserDto {
  newPassword?: string;
}
