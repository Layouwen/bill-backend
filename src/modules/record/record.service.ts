import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ObjectLiteral, Repository } from 'typeorm';
import { created, math, throwFail } from '../../utils';
import { Category } from '../category/entity/category.entity';
import { User } from '../user/entity/user.entity';
import {
  CreateRecordDto,
  SearchRecordListDto,
  UpdateRecordDto,
} from './dto/record.dto';
import { Record } from './entity/record.entity';

enum MoneyType {
  INCOME = '+',
  EXPEND = '-',
}

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
      order: { time: 'DESC', createdAt: 'DESC' },
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
    const [totalData, total] = await this.recordRepository.findAndCount(
      options,
    );

    const { page = 1, pageSize = 10 } = params;
    const data = await this.recordRepository.find({
      ...options,
      take: pageSize,
      skip: pageSize * (page - 1),
    });
    const income = this.getIncome(totalData);
    const expend = this.getExpend(totalData);
    return { data, total, income, expend };
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

  async update(id: number, updateRecordDto: UpdateRecordDto) {
    const { categoryId, ...params } = updateRecordDto;
    const record = await this.recordRepository.findOne(id);
    if (!record) throwFail('记录不存在');
    const category = await this.categoryRepository.findOne(categoryId);
    if (!category) throwFail('分类不存在');
    return this.recordRepository.save({ ...record, ...params, category });
  }

  delete(id: number) {
    return this.recordRepository.delete(id);
  }

  getIncome(data: Record[]) {
    return data
      .filter((i) => i.type === MoneyType.INCOME)
      .reduce((a, b) => math.add(a, parseFloat(b.amount)).toNumber(), 0);
  }

  getExpend(data: Record[]) {
    return data
      .filter((i) => i.type === MoneyType.EXPEND)
      .reduce((a, b) => math.add(a, parseFloat(b.amount)).toNumber(), 0);
  }

  async getBillRecord(id: number) {
    const { monthStart } = getTimestamp();
    const { month } = getNowTime();
    const { expend, income } = await this.findAll(id, {
      startDate: monthStart,
    });
    const surplus = math.subtract(income, expend).toNumber();
    return {
      month,
      expend,
      income,
      surplus,
    };
  }
}

const getNowTime = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  return {
    month,
  };
};

const getTimestamp = () => {
  return {
    monthStart: dayjs(new Date()).startOf('month').format(),
  };
};
