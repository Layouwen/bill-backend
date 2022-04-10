import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ObjectLiteral, Repository } from 'typeorm';
import { created } from '../../utils';
import { Category } from '../category/entity/category.entity';
import { User } from '../user/entity/user.entity';
import { CreateRecordDto, SearchRecordListDto } from './dto/record.dto';
import { Record } from './entity/record.entity';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(userId: number, params?: SearchRecordListDto) {
    const options = {
      where: { user: userId },
      order: { time: 'DEST' },
      relations: ['category'],
    } as ObjectLiteral;
    if (params) {
      const { startDate, endDate } = params;
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
    }
    const [data, count] = await this.recordRepository.findAndCount(options);
    return { data, count };
  }

  async create(userId: number, createRecordDto: CreateRecordDto) {
    const { time, remark, type, amount, categoryId } = createRecordDto;
    const user = await this.userRepository.findOne(userId);
    const category = await this.categoryRepository.findOne(categoryId);
    const record = new Record();
    record.user = user;
    record.time = dayjs(time).format();
    record.remark = remark;
    record.type = type;
    record.amount = amount;
    record.category = category;
    try {
      await this.recordRepository.save(record);
      return created();
    } catch (e) {
      return fail('创建失败');
    }
  }
}
