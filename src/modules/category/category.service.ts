import * as OSS from 'ali-oss';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorResponse, SuccessResponse } from '../../utils';
import { Category, Icon } from './entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Icon)
    private iconRepository: Repository<Icon>,
  ) {}

  async addCategory(userId: number, body: any, file: any) {
    const { name } = body;
    const { mineType, buffer } = file[0];
    const client = new OSS({
      region: 'oss-cn-guangzhou',
      accessKeyId: '',
      accessKeySecret: '',
      bucket: 'bill-rearend',
    });
    try {
      const { name: fileName, url } = await client.put(
        name + Date.now(),
        buffer,
        {
          mime: mineType,
        },
      );
      const icon = new Icon();
      icon.name = fileName;
      icon.url = url;
      const { id: iconId } = await this.iconRepository.save(icon);

      const category = new Category();
      category.name = name;
      category.iconId = iconId;
      category.userId = userId;
      await this.categoryRepository.save(category);
      return new SuccessResponse('添加成功');
    } catch (e) {
      console.log(e);
      return new ErrorResponse('添加失败');
    }
  }
}
