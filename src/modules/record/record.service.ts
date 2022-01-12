import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './entity/record.entity';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private usersRepository: Repository<Record>,
  ) {}
}
