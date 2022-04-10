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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IRequest } from '../../../custom';
import { created, fail, success } from '../../utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckInService } from '../check-in/check-in.service';
import { UserService } from '../user/user.service';
import {
  AddCommentDto,
  CreateTopicDto,
  getTopicDetailDto,
} from './dto/topic.dto';
import { TopicService } from './topic.service';

@ApiTags('topic')
@Controller('topic')
export class TopicController {
  constructor(
    private readonly topicService: TopicService,
    private readonly usersService: UserService,
    private readonly checkInService: CheckInService,
  ) {}

  @Get('/user/:id')
  @ApiOperation({ summary: '获取与帖子相关的用户信息' })
  async getTopicRelatedUserInfo(@Param('id') id: string) {
    const userInfo = await this.usersService.getUserInfo(parseInt(id));
    if (!userInfo) {
      return fail('用户不存在');
    }
    const checkInfo = await this.checkInService.getCheckInInfo(parseInt(id));
    const topics = await this.topicService.getTopics(parseInt(id), true);
    return success({ userInfo, checkInfo, topics });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取文章详情' })
  async getTopicsDetail(
    @Param() params: getTopicDetailDto,
    @Req() req: IRequest,
  ) {
    const topic = await this.topicService.getTopicsDetail(
      parseInt(params.id),
      req.info?.id,
    );
    return success(topic);
  }

  @Get()
  @ApiOperation({ summary: '获取文章列表' })
  async getTopics(
    @Query('recommend', ParseBoolPipe) recommend: boolean,
    @Req() req,
  ) {
    const topics = await this.topicService.getTopics(
      req.info?.id,
      false,
      recommend,
    );
    return success(topics);
  }

  @Post(':id/comment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Token')
  @ApiOperation({ summary: '评论文章' })
  async addComment(
    @Req() req,
    @Param('id') id: string,
    @Body() addComment: AddCommentDto,
  ) {
    await this.topicService.addComment(req.user.id, id, addComment);
    return success('评论成功');
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Token')
  @ApiOperation({ summary: '创建文章' })
  async addTopic(@Req() req, @Body() addTopicDto: CreateTopicDto) {
    await this.topicService.addTopic(req.user.id, addTopicDto);
    return created();
  }

  @Put('like/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Token')
  @ApiOperation({ summary: '点赞' })
  async topicLike(@Req() req, @Param('id') id: number) {
    const flag = await this.topicService.toggleLike(req.user.id, id);
    throw new HttpException({ message: flag ? '点赞成功' : '点赞失败' }, 200);
  }
}
