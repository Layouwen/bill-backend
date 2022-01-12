import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  @Column()
  user: User;

  @Column({ nullable: false })
  remark: string;

  @Column({ type: 'timestamp', nullable: false })
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
