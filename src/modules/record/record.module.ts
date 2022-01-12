import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { Record } from './entity/record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Record])],
  providers: [RecordService],
  controllers: [RecordController],
})
export class RecordModule {}
