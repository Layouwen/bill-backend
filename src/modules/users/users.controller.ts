import { Controller, Get } from '@nestjs/common';
import { SuccessResponse } from '../../utils';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll() {
    const res = await this.usersService.findAll();
    return new SuccessResponse(res);
  }
}
