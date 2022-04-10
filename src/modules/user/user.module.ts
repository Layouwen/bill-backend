import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInModule } from '../check-in/check-in.module';
import { RecordModule } from '../record/record.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CheckInModule, RecordModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
