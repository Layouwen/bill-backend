import {
  Body,
  Controller,
  Get,
  ParseBoolPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTopicDto } from './dto/topic.dto';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  async getTopics(@Query('recommend', ParseBoolPipe) recommend: boolean) {
    return await this.topicService.getTopics({ recommend });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addTopic(@Req() req, @Body() addTopicDto: CreateTopicDto) {
    return await this.topicService.addTopic(req.user.id, addTopicDto);
  }
}
