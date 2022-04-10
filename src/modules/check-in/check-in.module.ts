import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordModule } from '../record/record.module';
import { User } from '../user/entity/user.entity';
import { CheckInService } from './check-in.service';
import { CheckInController } from './check-in.controller';
import { CheckIn } from './entities/check-in.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CheckIn, User]), RecordModule],
  controllers: [CheckInController],
  providers: [CheckInService],
  exports: [CheckInService],
})
export class CheckInModule {}
