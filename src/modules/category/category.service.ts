import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { fail, getFileHash, qiniuOss } from '../../utils';
import { createCategory } from '../../utils/compatible/category';
import {
  createDefaultCategoryExpend,
  createDefaultCategoryIncome,
} from '../../utils/createDefaultCategory';
import { User } from '../user/entity/user.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Category } from './entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    userId: number,
    { name }: CreateCategoryDto,
    file: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne(userId);
    const findFromName = await this.categoryRepository.findOne({
      user,
      name,
    });
    if (findFromName) return fail('分类名称已存在');

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

  async remove(id: string) {
    const category = await this.findOne(id);
    if (!category) return fail('分类不存在');
    return this.categoryRepository.remove(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if (!category) return fail('分类不存在');
    return this.categoryRepository.update(category, updateCategoryDto);
  }

  findOne(id: string) {
    return this.categoryRepository.findOne(id);
  }

  async findAll(userId: number, type = '-') {
    const options = {
      where: { user: userId, type },
      order: { id: 'DESC' },
    } as ObjectLiteral;
    const hasExpend = await this.categoryRepository.findOne({
      where: { user: userId, type: '-', icon: 'catering' },
    });
    const hasIncome = await this.categoryRepository.findOne({
      where: { user: userId, type: '+', icon: 'part-time' },
    });
    if (!hasIncome) {
      await createCategory(
        this.categoryRepository,
        createDefaultCategoryIncome(userId + ''),
      );
    }
    if (!hasExpend) {
      await createCategory(
        this.categoryRepository,
        createDefaultCategoryExpend(userId + ''),
      );
    }
    const [data, total] = await this.categoryRepository.findAndCount(options);
    return { data, total };
  }
}
