import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Topic } from './topic.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar' })
  content: string;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @ManyToOne('User', 'comments')
  user: User;
  @ManyToOne('Topic', 'comments')
  topic: Topic;
  @ManyToOne('Comment', 'replyTo')
  replyTo: Comment;
}
