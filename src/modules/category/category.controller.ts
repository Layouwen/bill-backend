import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  UseGuards,
  Request,
  Body,
  UseInterceptors,
  Post,
  UploadedFile,
  Get,
  Query,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { QueryDto } from '../../dto/query.dto';
import { created, deleted, success, updated } from '../../utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Token')
@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: '获取分类列表' })
  async findAll(@Request() req, @Query() query: QueryDto) {
    const data = await this.categoryService.findAll(req.user.id, query);
    return success(data);
  }

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
  async create(
    @Request() req,
    @Body() body: CreateCategoryDto,
    @UploadedFile() files: Express.Multer.File,
  ) {
    const userId = req.user.id;
    await this.categoryService.create(userId, body, files);
    return created();
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除类别' })
  async remove(@Param('id') id: string) {
    await this.categoryService.remove(id);
    return deleted();
  }

  @Put(':id')
  @ApiOperation({ summary: '更新类别' })
  async update(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    await this.categoryService.update(id, body);
    return updated();
  }
}
