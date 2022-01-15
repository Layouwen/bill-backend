import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTopicDto } from './dto/topic.dto';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  async getTopics() {
    return await this.topicService.getTopics();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addTopic(@Req() req, @Body() addTopicDto: CreateTopicDto) {
    return await this.topicService.addTopic(req.user.id, addTopicDto);
  }
}
