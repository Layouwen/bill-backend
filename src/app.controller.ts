import { Controller, Get } from '@nestjs/common';
import { UsersService } from './modules/users/users.service';
import { SuccessResponse } from './utils';

@Controller()
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async test() {
    const users = await this.usersService.findOne('ddd');
    delete users.password;
    delete users.isActive;
    return new SuccessResponse(users);
  }
}
