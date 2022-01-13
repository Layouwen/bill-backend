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
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('User', 'id', { nullable: false })
  @JoinColumn({ name: 'userId' })
  userId: number;

  @Column({ nullable: false })
  remark: string;

  @Column({ type: 'datetime', nullable: false })
  time: Date;

  @Column({ nullable: false })
  categoryId: string;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: false })
  amount: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
