import {
  Body,
  Controller,
  forwardRef,
  Get,
  HttpException,
  Inject,
  Param,
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
import { FollowService } from '../follow/follow.service';
import { UserService } from '../user/user.service';
import { GetTopicListQueryDto } from './dto/get-topic-list-query.dto';
import {
  CreateCommentDto,
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
    @Inject(forwardRef(() => FollowService))
    private readonly followService: FollowService,
  ) {}

  @Get(':id/comment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Token')
  @ApiOperation({ summary: '获取评论列表' })
  async getComment(@Req() req, @Param('id') id: string) {
    const res = await this.topicService.getComments(id);
    return success(res);
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
    return created('评论成功');
  }

  @Get('/user/:id')
  @ApiOperation({ summary: '获取与帖子相关的用户信息' })
  async getTopicRelatedUserInfo(@Param('id') id: string, @Req() req: IRequest) {
    const userInfo = await this.usersService.getUserInfo(parseInt(id));
    if (!userInfo) {
      return fail('用户不存在');
    }
    const checkInfo = await this.checkInService.getCheckInInfo(parseInt(id));
    const topics = await this.topicService.getTopics(parseInt(id), true);
    const followList = await this.followService.findAllToTopicUserInfo(
      parseInt(id),
    );
    const data = { userInfo, checkInfo, topics, ...followList } as any;
    if (req?.info?.id) {
      data.isFollow = await this.followService.isFollow(
        req.info.id,
        parseInt(id),
      );
    }
    return success(data);
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
  async getTopics(@Req() req, @Query() query: GetTopicListQueryDto) {
    const topics = await this.topicService.getTopics(
      req.info?.id,
      false,
      query,
    );
    return success(topics);
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
