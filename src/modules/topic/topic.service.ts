import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { AddCommentDto, CreateTopicDto } from './dto/topic.dto';
import { Comment } from './entty/comment.entity';
import { Topic, TopicLike } from './entty/topic.entity';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(TopicLike)
    private readonly topicLikeRepository: Repository<TopicLike>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async addTopic(userId: number, createTopicDto: CreateTopicDto) {
    const { content, images } = createTopicDto;
    if (!content) return fail('内容不能为空');
    const user = await this.userRepository.findOne(userId);
    const topic = new Topic();
    topic.user = user;
    topic.content = content;
    topic.images = images;
    return this.topicRepository.save(topic);
  }

  async getTopicsDetail(topicId: number, userId: number) {
    const topic = await this.topicRepository
      .createQueryBuilder('topic')
      .leftJoin('topic.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.avatar'])
      .where('topic.id = :topicId', { topicId })
      .getOne();
    const count = await this.getTopicInfoCount(topicId);
    const result = {
      ...topic,
      ...count,
      isLike: false,
      comments: [],
    };
    if (await this.getUserIsLike(userId, topicId)) {
      result.isLike = true;
    }

    result.comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.avatar'])
      .where('comment.topicId = :topicId', { topicId })
      .orderBy('comment.createdAt', 'DESC')
      .getMany();
    return result;
  }

  async getTopics(userId?: number, isOwn = false, recommend = false) {
    const topicRepositoryFind = this.topicRepository
      .createQueryBuilder('topic')
      .leftJoin('topic.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.avatar'])
      .orderBy('topic.createdAt', 'DESC');
    if (recommend) {
      topicRepositoryFind.where('topic.recommend = :recommend', { recommend });
    }
    if (isOwn && userId) {
      topicRepositoryFind.andWhere('topic.userId = :userId', { userId });
    }
    const topics = await topicRepositoryFind.getMany();

    const res = [];
    for (const topic of topics) {
      const count = await this.getTopicInfoCount(topic.id);
      const i = {
        ...topic,
        ...count,
        isLike: false,
      };
      if (userId) {
        const likeStatus = await this.getUserIsLike(userId, topic.id);
        likeStatus && (i.isLike = true);
      }
      res.push(i);
    }
    return res;
  }

  async toggleLike(userId, topicId) {
    const user = await this.userRepository.findOne(userId);
    const topic = await this.topicRepository.findOne(topicId);
    const vote = await this.topicLikeRepository.findOne({
      where: { user, topic },
    });
    if (!vote) {
      const topicLike = new TopicLike();
      topicLike.user = user;
      topicLike.isLike = true;
      topicLike.topic = topic;
      await this.topicLikeRepository.save(topicLike);
    } else {
      await this.topicLikeRepository.update(vote.id, {
        isLike: !vote.isLike,
      });
    }
    return true;
  }

  async getUserIsLike(userId, topicId) {
    const u = await this.userRepository.findOne(userId);
    const t = await this.topicRepository.findOne(topicId);
    const like = await this.topicLikeRepository.findOne({
      user: u,
      topic: t,
      isLike: true,
    });
    return !!like;
  }

  async getTopicInfoCount(topicId: number) {
    const likeCount = await this.topicLikeRepository.count({
      where: {
        topic: topicId,
        isLike: true,
      },
    });
    const commentCount = await this.commentRepository.count({
      where: {
        topic: topicId,
        replyTo: IsNull(),
      },
    });
    const shareCount = 0;
    return { likeCount, commentCount, shareCount };
  }

  async addComment(userId: number, topicId: string, addComment: AddCommentDto) {
    const { content, replyTo } = addComment;
    const comment = new Comment();
    comment.user = await this.userRepository.findOne(userId);
    comment.topic = await this.topicRepository.findOne(topicId);
    comment.content = content;
    if (replyTo) {
      comment.replyTo = await this.commentRepository.findOne(replyTo);
    }
    await this.commentRepository.save(comment);
  }
}
