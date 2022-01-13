import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRecordDto, SearchRecordListDto } from './dto/record.dto';
import { RecordService } from './record.service';

@UseGuards(JwtAuthGuard)
@Controller('record')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  async getRecordList(@Request() req, @Body() body: SearchRecordListDto) {
    return await this.recordService.findAll(req.user.id, body);
  }

  @Post()
  async addRecord(@Request() req, @Body() body: CreateRecordDto) {
    return await this.recordService.create(req.user.id, body);
  }
}
