import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { CheckInService } from './check-in.service';
import { CheckInController } from './check-in.controller';
import { CheckIn } from './entities/check-in.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CheckIn, User])],
  controllers: [CheckInController],
  providers: [CheckInService],
  exports: [CheckInService],
})
export class CheckInModule {}
