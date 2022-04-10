import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  images: string[];

  @Column({ nullable: true, type: 'text' })
  content: string;

  @Column({ nullable: true, default: false })
  recommend: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne('User', 'topics')
  user: User;

  @OneToMany('TopicLike', 'topic')
  topicLikes: TopicLike[];

  @OneToMany('Comment', 'topic')
  comments: Comment[];
}

@Entity()
export class TopicLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: false })
  isLike: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne('User', 'topicLikes')
  user: User;

  @ManyToOne('Topic', 'topicLikes')
  topic: Topic;
}
