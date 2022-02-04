import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { Comment } from './entty/comment.entity';
import { Topic, TopicLike } from './entty/topic.entity';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
  imports: [TypeOrmModule.forFeature([Topic, TopicLike, User, Comment])],
  providers: [TopicService],
  controllers: [TopicController],
})
export class TopicModule {}
