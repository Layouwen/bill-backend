import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Record } from '../../record/entity/record.entity';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'varchar' })
  icon: string;

  @Column({ type: 'enum', enum: ['add', 'sub'] })
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne('User', 'category')
  user: User;

  @OneToMany('Record', 'category')
  records: Record[];
}
