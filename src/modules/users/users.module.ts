import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInModule } from '../check-in/check-in.module';
import { RecordModule } from '../record/record.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CheckInModule, RecordModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
