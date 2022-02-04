import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { UsersService } from './modules/users/users.service';
import { ErrorResponse, getFileHash, qiniuOss, SuccessResponse } from './utils';

@Controller()
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiTags('upload')
  @UseInterceptors(FileInterceptor('file')) // TODO: 校验文件类型
  @ApiOperation({ summary: '上传文件' })
  @ApiBearerAuth('Token')
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
