import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { UsersService } from './modules/users/users.service';
import { ErrorResponse, SuccessResponse, uploadFile } from './utils';

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

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file')) // TODO: 校验文件类型
  async uploadFile(@UploadedFile() file) {
    if (!file) return new ErrorResponse('上传失败');
    const { url } = await uploadFile(file);
    return new SuccessResponse({ url });
  }
}
