import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic, TopicLike } from './entty/topic.entity';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
  imports: [TypeOrmModule.forFeature([Topic, TopicLike])],
  providers: [TopicService],
  controllers: [TopicController],
})
export class TopicModule {}
