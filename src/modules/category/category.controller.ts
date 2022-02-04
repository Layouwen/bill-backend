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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessResponse } from '../../utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoryService } from './category.service';
import { AddCategoryDto } from './dto/category.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Token')
@ApiTags('category')
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
  @ApiOperation({ summary: '添加类别' })
  async upload(
    @Request() req,
    @Body() body: AddCategoryDto,
    @UploadedFile() files: Express.Multer.File,
  ) {
    const userId = req.user.id;
    await this.categoryService.addCategory(userId, body, files);
    return new SuccessResponse('添加成功');
  }
}
