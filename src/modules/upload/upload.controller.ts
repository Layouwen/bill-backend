import { AnyFilesInterceptor } from '@nestjs/platform-express';
import * as OSS from 'ali-oss';
import {
  Controller,
  UseGuards,
  Request,
  Body,
  Put,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadService } from './upload.service';

// @UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly recordService: UploadService) {}

  @Put()
  @UseInterceptors(AnyFilesInterceptor())
  async upload(@Request() req, @UploadedFiles() file) {
    console.log(file);
    return JSON.stringify(file);
  }
}
