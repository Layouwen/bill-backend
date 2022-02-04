import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getFileHash, qiniuOss } from '../../utils';
import { User } from '../users/entity/user.entity';
import { AddCategoryDto } from './dto/category.dto';
import { Category } from './entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async addCategory(
    userId: number,
    { name }: AddCategoryDto,
    file: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne(userId);
    const findFromName = await this.categoryRepository.findOne({
      user,
      name,
    });
    if (findFromName) throw new HttpException({ message: '该分类已存在' }, 200);

    const { url } = await qiniuOss.uploadFile(
      file,
      getFileHash(file),
      `/user_${user.username}/`,
    );

    const category = new Category();
    category.user = user;
    category.name = name;
    category.icon = url;
    return await this.categoryRepository.save(category);
  }
}
