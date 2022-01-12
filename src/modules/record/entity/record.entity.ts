import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  remark: string;

  @Column({ nullable: false })
  time: string;

  @Column({ default: true })
  categoryId: boolean;

  @Column({ default: true })
  type: string;

  @Column({ default: true })
  amount: string;
}
