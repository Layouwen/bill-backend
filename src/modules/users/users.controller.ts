import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ErrorResponse, SuccessResponse } from '../../utils';
import {
  CreateUserDto,
  DeleteUserDto,
  LoginUserDto,
  UpdateUserDto,
} from './dto/users.dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id(\\d+)')
  async getUserInfo(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);
    if (user) {
      return new SuccessResponse(user);
    } else {
      return new ErrorResponse('user not found');
    }
  }

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const res = await this.usersService.findOne(body);
    if (res && res.isActive) {
      return new SuccessResponse('login success');
    } else {
      return new ErrorResponse('login failed');
    }
  }

  @Post()
  async sign(@Body() userBody: CreateUserDto) {
    const { name, username, password } = userBody;
    const user = new User();
    user.name = name;
    user.username = username;
    user.password = password;
    try {
      await this.usersService.create(user);
      return new SuccessResponse('registration success');
    } catch (e) {
      return new ErrorResponse(e.sqlMessage);
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    const { password, newPassword, name } = body;
    const user = await this.usersService.findOne(id, { password });
    if (user) {
      await this.usersService.update({
        ...user,
        name,
        password: newPassword,
      });
      return new SuccessResponse('update success');
    } else {
      return new ErrorResponse('update fail');
    }
  }

  @Get('/all')
  async getAllUserInfo() {
    const users = await this.usersService.findAll();
    return new SuccessResponse(users);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number, @Body() body: DeleteUserDto) {
    const { username, password } = body;
    const user = await this.usersService.findOne(id, { username, password });
    if (user) {
      await this.usersService.remove(id);
      return new SuccessResponse('delete success');
    } else {
      return new ErrorResponse('delete failed');
    }
  }
}
