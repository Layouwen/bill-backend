import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  UseGuards,
  Request,
  Body,
  Put,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Post,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoryService } from './category.service';

@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async upload(@Request() req, @Body() body, @UploadedFiles() file) {
    const userId = req.user.id;
    return this.categoryService.addCategory(userId, body, file);
    // return JSON.stringify(file);
  }
}
