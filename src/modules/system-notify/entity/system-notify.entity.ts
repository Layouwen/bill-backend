import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity()
export class SystemNotify {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  content: string;

  @Column({ type: 'boolean', default: true })
  isGlobal?: boolean;

  @Column({ type: 'varchar', default: '' })
  coverPicture?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne('User', 'systemNotifies')
  user: User;
}
