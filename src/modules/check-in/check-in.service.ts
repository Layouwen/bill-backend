import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Between, Repository } from 'typeorm';
import { getStartAndEndTime } from '../../utils/time';
import { RecordService } from '../record/record.service';
import { User } from '../user/entity/user.entity';
import { CheckIn } from './entities/check-in.entity';

@Injectable()
export class CheckInService {
  constructor(
    @InjectRepository(CheckIn)
    private checkInRepository: Repository<CheckIn>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private recordService: RecordService,
  ) {}

  async create(userId: number) {
    const hasCheckIn = await this.hasCheckIn(userId);
    if (hasCheckIn) {
      throw new HttpException('已经签到过了', HttpStatus.CREATED);
    }
    const checkIn = new CheckIn();
    checkIn.user = await this.userRepository.findOne(userId);
    checkIn.checkInTime = dayjs().format();
    return this.checkInRepository.save(checkIn);
  }

  // findAll() {
  //   return `This action returns all checkIn`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} checkIn`;
  // }

  // update(id: number, updateCheckInDto: UpdateCheckInDto) {
  //   return `This action updates a #${id} checkIn`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} checkIn`;
  // }

  hasCheckIn(userId: number) {
    const { startTime, endTime } = getStartAndEndTime();
    return this.checkInRepository.findOne({
      where: {
        user: userId,
        checkInTime: Between(startTime, endTime),
      },
    });
  }

  async getCheckInInfo(userId: number) {
    const [list, checkInAll] = await this.checkInRepository.findAndCount({
      where: { user: userId },
      order: { checkInTime: 'DESC' },
    });
    const { count } = await this.recordService.findAll(userId);
    return {
      checkInKeep: getContinueDay(list),
      checkInAll,
      recordCount: count || 0,
    };
  }
}

const getContinueDay = (list: { checkInTime: string }[]) => {
  let day = 0;
  if (!list.length) return day;
  let nowStartDay = dayjs().startOf('day');
  const left = dayjs().subtract(1, 'day').startOf('day');
  const right = dayjs().endOf('day');
  if (dayjs(list[0].checkInTime).isBetween(left, right, null, '[]')) {
    if (!dayjs(list[0].checkInTime).isSame(nowStartDay, 'day')) {
      nowStartDay = nowStartDay.subtract(1, 'day');
    }
    for (const i of list) {
      const dayStart = dayjs(nowStartDay).startOf('day');
      const dayEnd = dayjs(nowStartDay).endOf('day');
      if (!dayjs(i.checkInTime).isBetween(dayStart, dayEnd, 'day', '[]')) break;
      day++;
      nowStartDay = nowStartDay.subtract(1, 'day');
    }
  }
  return day;
};
