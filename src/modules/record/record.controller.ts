import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
  Query,
  Put,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { created, deleted, success, updated } from '../../utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateRecordDto,
  GetRecordListDto,
  UpdateRecordDto,
} from './dto/record.dto';
import { RecordService } from './record.service';

@ApiTags('record')
@UseGuards(JwtAuthGuard)
@Controller('record')
@ApiBearerAuth('Token')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  @ApiOperation({ summary: '明细页数据' })
  async findAll(@Request() req, @Query() query: GetRecordListDto) {
    const data = await this.recordService.findAll(+req.user.id, query);
    return success(data);
  }

  @Post()
  @ApiOperation({ summary: '添加记录' })
  async create(@Request() req, @Body() body: CreateRecordDto) {
    await this.recordService.create(+req.user.id, body);
    return created();
  }

  @Put(':id')
  @ApiOperation({ summary: '更新记录' })
  async update(
    @Param('id') id: string,
    @Body() updateRecordDto: UpdateRecordDto,
  ) {
    await this.recordService.update(+id, updateRecordDto);
    return updated();
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除记录' })
  async remove(@Param('id') id: string) {
    await this.recordService.remove(+id);
    return deleted();
  }

  @Post('import_data')
  @ApiOperation({ summary: '导入数据' })
  @UseInterceptors(FileInterceptor('file'))
  async importData(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const res = await this.recordService.importData(file.buffer, req.info.id);
    return success(res, '导入成功');
  }
}
