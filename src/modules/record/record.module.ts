import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entity/category.entity';
import { User } from '../users/entity/user.entity';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { Record } from './entity/record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Record, User, Category])],
  providers: [RecordService],
  controllers: [RecordController],
  exports: [RecordService],
})
export class RecordModule {}
