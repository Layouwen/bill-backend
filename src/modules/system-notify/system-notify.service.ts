import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { throwFail } from '../../utils';
import { UserService } from '../user/user.service';
import { CreateSystemNotifyDto } from './dto/system-notify.dto';
import { SystemNotify } from './entity/system-notify.entity';

@Injectable()
export class SystemNotifyService {
  constructor(
    @InjectRepository(SystemNotify)
    private readonly systemNotifyRepository: Repository<SystemNotify>,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, createSystemNotifyDto: CreateSystemNotifyDto) {
    const {
      content,
      isGlobal = true,
      coverPicture = '',
    } = createSystemNotifyDto;
    const systemNotify = new SystemNotify();
    const user = await this.userService.findOne(+userId);
    if (!user) {
      throwFail('用户不存在');
    }
    systemNotify.user = user;
    systemNotify.content = content;
    systemNotify.isGlobal = isGlobal;
    systemNotify.coverPicture = coverPicture;
    return this.systemNotifyRepository.save(systemNotify);
  }

  findAll() {
    return this.systemNotifyRepository.find({
      where: { isGlobal: true },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }
}
