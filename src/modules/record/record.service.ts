import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuccessResponse } from '../../utils';
import { CreateRecordDto } from './dto/record.dto';
import { Record } from './entity/record.entity';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
  ) {}

  async findAll(id: number) {
    const recordList = await this.recordRepository.find({
      where: { userId: id },
    });
    console.log(recordList);
    return new SuccessResponse(recordList);
  }

  async create(userId: string, createRecordDto: CreateRecordDto) {
    const params = {
      ...createRecordDto,
      time: new Date(),
    } as Record;
    await this.recordRepository.save(params);
    return new SuccessResponse('创建成功');
  }
}
