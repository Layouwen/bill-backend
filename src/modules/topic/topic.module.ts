import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInModule } from '../check-in/check-in.module';
import { FollowModule } from '../follow/follow.module';
import { User } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { Comment } from './entty/comment.entity';
import { Topic, TopicLike } from './entty/topic.entity';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic, TopicLike, User, Comment]),
    UserModule,
    CheckInModule,
    forwardRef(() => FollowModule),
  ],
  providers: [TopicService],
  controllers: [TopicController],
  exports: [TopicService],
})
export class TopicModule {}
