import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  aliOss,
  ErrorResponse,
  getFileHash,
  SuccessResponse,
} from '../../utils';
import { AddCategoryDto } from './dto/category.dto';
import { Category, Icon } from './entity/category.entity';

const DEFAULT_ICON_ID = 0;

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Icon)
    private iconRepository: Repository<Icon>,
  ) {}

  async addCategory(
    userId: number,
    body: AddCategoryDto,
    files: Array<Express.Multer.File>,
  ) {
    const { name } = body;
    try {
      let iconId;
      if (files) {
        const { name: fileName, url } = await aliOss.uploadFile(
          files[0],
          'category',
        );
        const hash = getFileHash(files[0]);
        const hasIcon = await this.iconRepository.findOne({
          where: { name: hash },
        });
        if (!hasIcon) {
          const icon = new Icon();
          icon.name = fileName;
          icon.url = url;
          icon.userId = userId;
          const { id } = await this.iconRepository.save(icon);
          iconId = id;
        } else {
          iconId = hasIcon.id;
        }
      }

      const hasCategory = await this.categoryRepository.findOne({
        where: { name, userId },
      });
      if (hasCategory) {
        return new SuccessResponse('分类已存在');
      }

      const category = new Category();
      category.name = name;
      category.iconId = iconId || DEFAULT_ICON_ID;
      category.userId = userId;
      await this.categoryRepository.save(category);
      return new SuccessResponse('添加成功');
    } catch (e) {
      console.error(e);
      return new ErrorResponse('添加失败');
    }
  }
}
