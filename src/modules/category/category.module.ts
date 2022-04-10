import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User])],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
