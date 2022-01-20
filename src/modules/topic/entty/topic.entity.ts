import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('User', 'id', { nullable: false })
  @JoinColumn({ name: 'userId' })
  userId: number;

  @Column({ type: 'json' })
  images: string[];

  @Column({ nullable: true, type: 'text' })
  content: string;

  @Column({ nullable: true, default: false })
  recommend: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class TopicLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('User', 'id', { nullable: false })
  @JoinColumn({ name: 'userId' })
  userId: number;

  @ManyToOne('Topic', 'id', { nullable: false })
  @JoinColumn({ name: 'topicId' })
  topicId: number;

  @Column({ nullable: false, default: false })
  isLike: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
