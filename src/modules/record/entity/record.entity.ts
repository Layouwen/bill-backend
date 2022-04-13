import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../category/entity/category.entity';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  remark: string;

  @Column({ type: 'timestamp' })
  time: string;

  @Column({ nullable: false, enum: ['-', '+'] })
  type: string;

  @Column({ nullable: false })
  amount: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne('User', 'records')
  user: User;

  @ManyToOne('Category', 'records')
  category: Category;
}
