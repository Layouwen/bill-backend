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
import { getFileHash, qiniuOss, success, fail } from './utils';

@Controller()
export class AppController {
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiTags('upload')
  @UseInterceptors(FileInterceptor('file')) // TODO: 校验文件类型
  @ApiOperation({ summary: '上传文件' })
  @ApiBearerAuth('Token')
  async uploadFile(@UploadedFile() file, @Req() req) {
    if (!file) return fail('上传失败');
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
      return success({ url });
    }
    return fail('上传失败');
  }
}
