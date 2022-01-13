import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  UseGuards,
  Request,
  Body,
  UseInterceptors,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoryService } from './category.service';
import { AddCategoryDto } from './dto/category.dto';

@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async upload(
    @Request() req,
    @Body() body: AddCategoryDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const userId = req.user.id;
    return this.categoryService.addCategory(userId, body, files);
  }
}
