import { Module } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { ChartsController } from './charts.controller';

@Module({
  controllers: [ChartsController],
  providers: [ChartsService]
})
export class ChartsModule {}
