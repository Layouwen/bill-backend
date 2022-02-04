import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRecordDto, SearchRecordListDto } from './dto/record.dto';
import { RecordService } from './record.service';

@ApiTags('record')
@UseGuards(JwtAuthGuard)
@Controller('record')
@ApiBearerAuth('Token')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  @ApiOperation({ summary: '获取记录' })
  async getRecordList(@Request() req, @Body() body: SearchRecordListDto) {
    return await this.recordService.findAll(req.user.id, body);
  }

  @Post()
  @ApiOperation({ summary: '添加记录' })
  async addRecord(@Request() req, @Body() body: CreateRecordDto) {
    return await this.recordService.create(req.user.id, body);
  }
}
