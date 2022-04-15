import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { QueryDto } from '../../dto/query.dto';
import { fail, getFileHash, qiniuOss } from '../../utils';
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

  async findAll(userId: number, params?: QueryDto) {
    const options = {
      where: { user: userId },
      order: { id: 'DESC' },
    } as ObjectLiteral;
    const total = await this.categoryRepository.count(options);
    if (params.page) {
      const { page = 1, pageSize = 10 } = params;
      options.skip = page;
      options.take = pageSize;
    }
    const data = await this.categoryRepository.find(options);
    return { data, total };
  }
}
