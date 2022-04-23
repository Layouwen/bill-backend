import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { throwFail } from '../../utils';
import { TopicService } from '../topic/topic.service';
import { UserService } from '../user/user.service';
import { Follow } from './entities/follow.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => TopicService))
    private readonly topicService: TopicService,
  ) {}

  async findAllToTopicUserInfo(id: number, onlyCount = true) {
    const { data: follow, count: followCount } = await this.getFollowList(id);
    const { data: fans, count: fansCount } = await this.getFansList(id);
    if (onlyCount) {
      return {
        follow: followCount,
        fans: fansCount,
      };
    }
    return {
      follow: {
        data: follow,
        count: followCount,
      },
      fans: {
        data: fans,
        count: fansCount,
      },
    };
  }

  async create(userId: number, followId: number) {
    const follow = new Follow();
    const user = await this.userService.findOne(userId);
    if (!user) {
      throwFail('无此用户');
    }
    const followUser = await this.userService.findOne(followId);
    if (await this.isFollow(userId, followId)) {
      throwFail('已经关注此用户');
    }
    follow.user = user;
    follow.follow = followUser;
    return this.followRepository.save(follow);
  }

  async remove(userId: number, followId: number) {
    const follow = await this.followRepository.findOne({
      where: { user: userId, follow: followId },
    });
    if (!follow) {
      throwFail('无此关注');
    }
    return this.followRepository.remove(follow);
  }

  async isFollow(userId: number, followId: number) {
    const res = await this.followRepository.findOne({
      where: {
        user: userId,
        follow: followId,
      },
    });
    return !!res;
  }

  async getFollowList(followId: number, deep = true, userId?: number) {
    const [follows, count] = await this.followRepository.findAndCount({
      where: { user: followId },
      relations: ['follow'],
    });
    const data = [];
    if (deep && follows.length) {
      for (let i = 0; i < follows.length; i++) {
        const result = follows[i] as any;
        const { avatar, name, id } = follows[i].follow;
        result.avatar = avatar;
        result.name = name;
        result.userId = id;
        result.isFollow = await this.isFollow(userId, id);
        delete result.follow;
        result.follow = (await this.getFollowList(id, false)).count;
        result.fans = (await this.getFollowList(id, false)).count;
        result.topics = (
          await this.topicService.getTopics(id, true)
        ).topics.length;
        data[i] = result;
      }
    }
    return { data, count };
  }

  async getFansList(viewUserId: number, deep = true, userId?: number) {
    const [fans, count] = await this.followRepository.findAndCount({
      where: { follow: viewUserId },
      relations: ['user'],
    });
    const data = [];
    if (deep && fans.length) {
      for (let i = 0; i < fans.length; i++) {
        const result = fans[i] as any;
        const { avatar, name, id } = fans[i].user;
        result.avatar = avatar;
        result.name = name;
        result.userId = id;
        result.follow = (await this.getFollowList(id, false)).count;
        result.isFollow = await this.isFollow(userId, id);
        delete result.user;
        result.fans = (await this.getFollowList(id, false)).count;
        result.topics = (
          await this.topicService.getTopics(id, true)
        ).topics.length;
        data[i] = result;
      }
    }
    return { data, count };
  }
}
