import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { throwFail } from '../../utils';
import { UserService } from '../user/user.service';
import { Follow } from './entities/Follow.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    private readonly userService: UserService,
  ) {}

  async findAllToTopicUserInfo(id: number, onlyCount = true) {
    const { follow, count: followCount } = await this.getFollowList(id);
    const { fans, count: fansCount } = await this.getFansList(id);
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
    console.log(userId, followId);
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

  async getFollowList(followId: number) {
    const [follow, count] = await this.followRepository.findAndCount({
      where: { user: followId },
      relations: ['user'],
    });
    return { follow, count };
  }

  async getFansList(userId: number) {
    const [fans, count] = await this.followRepository.findAndCount({
      where: { follow: userId },
      relations: ['follow'],
    });
    return { fans, count };
  }
}
