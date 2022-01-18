import {
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { UsersService } from './modules/users/users.service';
import { ErrorResponse, getFileHash, qiniuOss, SuccessResponse } from './utils';

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
  async uploadFile(@UploadedFile() file, @Req() req) {
    if (!file) return new ErrorResponse('上传失败');
    // 阿里云
    // const { url } = await aliOss.uploadFile(
    //   file,
    //   getFileHash(file),
    //   `/user_${req.user.username}/`,
    // );
    // return new SuccessResponse({ url });

    // 七牛云
    const { url } = await qiniuOss.uploadFile(
      file,
      getFileHash(file),
      `/user_${req.user.username}/`,
    );
    if (url) {
      return new SuccessResponse({ url });
    }
    return new ErrorResponse('上传失败');
  }
}
