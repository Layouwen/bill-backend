import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../category/entity/category.entity';
import { Record } from '../../record/entity/record.entity';
import { Comment } from '../../topic/entty/comment.entity';
import { Topic, TopicLike } from '../../topic/entty/topic.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    default:
      'https://bill-rearend.oss-cn-guangzhou.aliyuncs.com/static/defulatAvatar.jpg',
  })
  avatar: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany('Topic', 'user')
  topics: Topic[];

  @OneToMany('TopicLike', 'user')
  topicLikes: TopicLike[];

  @OneToMany('Record', 'user')
  records: Record[];

  @OneToMany('Category', 'user')
  category: Category[];

  @OneToMany('Comment', 'user')
  comments: Comment[];
}
