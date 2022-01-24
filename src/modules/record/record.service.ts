import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ObjectLiteral, Repository } from 'typeorm';
import { ErrorResponse, SuccessResponse } from '../../utils';
import { CreateRecordDto, SearchRecordListDto } from './dto/record.dto';
import { Record } from './entity/record.entity';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
  ) {}

  async findAll(userId: number, params: SearchRecordListDto) {
    const { startDate, endDate } = params;
    const options = {
      where: {
        userId,
      },
      order: { time: 'DEST' },
    } as ObjectLiteral;
    if (startDate && endDate) {
      options.where.time = Between(
        dayjs(startDate).toDate(),
        dayjs(endDate).toDate(),
      );
    }
    if (startDate) {
      options.where.time = Between(
        dayjs(startDate).startOf('month').toDate(),
        dayjs(startDate).endOf('month').toDate(),
      );
    }
    const recordList = await this.recordRepository.find(options);
    return new SuccessResponse(recordList);
  }

  async create(userId: number, createRecordDto: CreateRecordDto) {
    const params = {
      userId,
      ...createRecordDto,
    } as Record;
    try {
      await this.recordRepository.save(params);
      return new SuccessResponse('创建成功');
    } catch (e) {
      console.log(e);
      return new ErrorResponse('创建失败');
    }
  }
}
