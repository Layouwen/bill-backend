import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  ParseBoolPipe,
  Post,
  Put,
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
  async getTopics(
    @Query('recommend', ParseBoolPipe) recommend: boolean,
    @Req() req,
  ) {
    return await this.topicService.getTopics({
      recommend,
      userId: req.userInfo.id || null,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addTopic(@Req() req, @Body() addTopicDto: CreateTopicDto) {
    return await this.topicService.addTopic(req.user.id, addTopicDto);
  }

  @Put('like/:id')
  @UseGuards(JwtAuthGuard)
  async topicLike(@Req() req, @Param('id') id: number) {
    const flag = this.topicService.toggleLike(req.user.id, id);
    if (flag) {
      throw new HttpException(
        {
          message: '点赞成功',
        },
        200,
      );
    } else {
      throw new HttpException(
        {
          message: '点赞失败',
        },
        400,
      );
    }
  }
}
