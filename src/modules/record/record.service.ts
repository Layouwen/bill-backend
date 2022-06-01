import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import xlsl from 'node-xlsx';
import { Between, ObjectLiteral, Repository } from 'typeorm';
import { math, throwFail } from '../../utils';
import { Category } from '../category/entity/category.entity';
import { User } from '../user/entity/user.entity';
import {
  CreateRecordDto,
  GetRecordListDto,
  UpdateRecordDto,
} from './dto/record.dto';
import { Record } from './entity/record.entity';

const typeMap = {
  支出: '-',
  收入: '+',
};

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
    return await this.recordRepository.save(record);
  }

  remove(id: number) {
    return this.recordRepository.delete(id);
  }

  async update(id: number, updateRecordDto: UpdateRecordDto) {
    const { categoryId, ...params } = updateRecordDto;
    const record = await this.findOne(id);
    if (!record) throwFail('记录不存在');
    const category = await this.categoryRepository.findOne(categoryId);
    if (!category) throwFail('分类不存在');
    return this.recordRepository.save({ ...record, ...params, category });
  }

  findOne(id: number) {
    return this.recordRepository.findOne(id);
  }

  async findAll(userId: number, params?: GetRecordListDto) {
    const options = {
      where: { user: userId },
      order: { time: 'DESC', createdAt: 'DESC' },
      relations: ['category'],
    } as ObjectLiteral;

    const recordData = await this.recordRepository.findAndCount(options);

    if (params) {
      const { startDate, endDate } = params;
      if (startDate && endDate) {
        options.where.time = Between(
          dayjs(startDate).startOf('day').toDate(),
          dayjs(endDate).endOf('day').toDate(),
        );
      } else if (startDate) {
        options.where.time = Between(
          dayjs(startDate).startOf('month').toDate(),
          dayjs(startDate).endOf('month').toDate(),
        );
      }
    }

    const data = await this.recordRepository.find(options);
    const income = this.getIncome(data);
    const expend = this.getExpend(data);
    return { data, total: recordData[1], income, expend };
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

  async importData(buffer: Buffer, id: number) {
    const form = xlsl.parse(buffer);
    const arr = form[0].data.slice(1) as RecordExcelData[];
    const categoryMap = await this.getUserAllCategory(id);
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      const [category, remark, amount, typeZh, time] = arr[i];
      const categoryId = categoryMap[category];
      const date = new Date(1900, 0, Number(time) - 1);
      const type = typeMap[typeZh];
      if (categoryId && remark && amount && type && time) {
        try {
          await this.create(id, {
            time: date.toISOString(),
            categoryId: categoryId + '',
            remark,
            type,
            amount: amount + '',
          });
          count++;
        } catch (e) {
          console.log('--------------------------');
          console.log('import data error: ' + e);
          console.log(arr[i]);
          console.log('--------------------------');
        }
      }
    }
    return {
      fail: arr.length - count,
      all: arr.length,
    };
  }

  async getUserAllCategory(id: number) {
    const data = await this.categoryRepository.find({ where: { user: id } });
    return data.reduce((pre, { name, id }) => {
      pre[name] = id;
      return pre;
    }, {} as { [key: string]: number });
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

type RecordExcelData = [
  CategoryString,
  RemarkString,
  AmountNumber,
  TypeString,
  TimeString,
];
type CategoryString = string;
type RemarkString = string;
type AmountNumber = number;
type TypeString = keyof typeof typeMap;
type TimeString = string;
