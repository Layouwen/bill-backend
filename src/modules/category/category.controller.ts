import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  UseGuards,
  Request,
  Body,
  UseInterceptors,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoryService } from './category.service';
import { AddCategoryDto } from './dto/category.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Token')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          description: '类别图片',
          format: 'binary',
        },
        name: {
          type: 'string',
          description: '类别',
          example: '分类1',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Request() req,
    @Body() body: AddCategoryDto,
    @UploadedFile() files: Express.Multer.File,
  ) {
    const userId = req.user.id;
    return this.categoryService.addCategory(userId, body, files);
  }
}
