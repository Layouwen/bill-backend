import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInModule } from '../check-in/check-in.module';
import { User } from '../users/entity/user.entity';
import { UsersModule } from '../users/users.module';
import { Comment } from './entty/comment.entity';
import { Topic, TopicLike } from './entty/topic.entity';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic, TopicLike, User, Comment]),
    UsersModule,
    CheckInModule,
  ],
  providers: [TopicService],
  controllers: [TopicController],
  exports: [TopicService],
})
export class TopicModule {}
