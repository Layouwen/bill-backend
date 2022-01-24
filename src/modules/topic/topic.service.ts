import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindCondition, Repository } from 'typeorm';
import { ErrorResponse, SuccessResponse } from '../../utils';
import { User } from '../users/entity/user.entity';
import { CreateTopicDto, GetTopicsDto } from './dto/topic.dto';
import { Topic, TopicLike } from './entty/topic.entity';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(TopicLike)
    private readonly topicLikeRepository: Repository<TopicLike>,
  ) {}

  async addTopic(userId: number, createTopicDto: CreateTopicDto) {
    if (!createTopicDto.content) return new ErrorResponse('内容不能为空');
    try {
      await this.topicRepository.save({
        ...createTopicDto,
        userId,
      });
      return new SuccessResponse('添加成功');
    } catch (e) {
      return new ErrorResponse('添加失败');
    }
  }

  async getTopics(getTopicsDto: GetTopicsDto) {
    const { recommend, userId } = getTopicsDto;
    const where = {} as FindCondition<Topic>;
    recommend && (where['recommend'] = recommend);
    const topics = await this.topicRepository.find({
      relations: ['userId', 'topicLikes'],
      where,
      order: {
        createdAt: 'DESC',
      },
    });
    const res = topics.map((i) => {
      const { name, avatar } = i.userId as unknown as User;
      const likes = i.topicLikes.filter((i) => i.isLike);
      const isLike = likes.some((i) => {
        return i.userId === userId;
      });
      delete i.userId;
      delete i.topicLikes;
      return {
        ...i,
        name,
        avatar,
        likeCount: likes.length,
        isLike,
      };
    });
    return new SuccessResponse(res);
  }

  async toggleLike(userId, topicId) {
    try {
      const findOne = await this.topicLikeRepository.findOne({
        where: { userId, topicId },
      });
      if (!findOne) {
        await this.topicLikeRepository.save({
          userId,
          topicId,
          isLike: true,
        });
      } else {
        await this.topicLikeRepository.update(findOne.id, {
          topicId,
          isLike: !findOne.isLike,
        });
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
