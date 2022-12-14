import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IRequest } from '../../../custom';
import { success } from '../../utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FollowListType, getFollowListDto } from './follow.dto';
import { FollowService } from './follow.service';

@ApiTags('follow')
@ApiBearerAuth('Token')
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @ApiOperation({ summary: '根据用户获取关注或粉丝列表' })
  @Get(':id')
  async getFollowByUserId(
    @Param('id') id: string,
    @Query() query: getFollowListDto,
    @Req() req: IRequest,
  ) {
    let follows;
    if (!query.type) {
      follows = await this.followService.findAllToTopicUserInfo(
        parseInt(id),
        false,
      );
    } else if (query.type === FollowListType.FOLLOW) {
      follows = await this.followService.getFollowList(
        parseInt(id),
        true,
        req.info?.id,
      );
    } else {
      follows = await this.followService.getFansList(
        parseInt(id),
        true,
        req.info?.id,
      );
    }
    return success(follows);
  }

  @ApiOperation({ summary: '关注用户' })
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async followUser(@Param('id') followId: string, @Req() req: IRequest) {
    await this.followService.create(req.info.id, parseInt(followId));
    return success('关注成功');
  }

  @ApiOperation({ summary: '取消关注用户' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async unFollowUser(@Param('id') followId: string, @Req() req: IRequest) {
    await this.followService.remove(req.info.id, parseInt(followId));
    return success('取消成功');
  }
}
