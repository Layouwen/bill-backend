import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorResponse, SuccessResponse } from '../../utils';
import { User } from '../users/entity/user.entity';
import { CreateTopicDto } from './dto/topic.dto';
import { Topic } from './entty/topic.entity';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
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

  async getTopics() {
    const topics = await this.topicRepository.find({
      relations: ['userId'],
      order: {
        createdAt: 'DESC',
      },
    });
    const res = topics.map((i) => {
      const { name } = i.userId as unknown as User;
      delete i.userId;
      return {
        ...i,
        name,
      };
    });
    return new SuccessResponse(res);
  }
}
