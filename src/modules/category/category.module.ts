import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category, Icon } from './entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Icon])],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
