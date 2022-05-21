import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { CompatibleController } from './compatible.controller';
import { CompatibleService } from './compatible.service';

@Module({
  imports: [TypeOrmModule.forFeature([]), UserModule],
  controllers: [CompatibleController],
  providers: [CompatibleService],
})
export class CompatibleModule {}
