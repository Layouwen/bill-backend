import { Repository } from 'typeorm';
import { Category } from '../../modules/category/entity/category.entity';
import { CategoryRecord } from '../createDefaultCategory';

export function createCategory(
  rep: Repository<Category>,
  categoryArr: CategoryRecord[],
) {
  return rep
    .createQueryBuilder()
    .insert()
    .into('category')
    .values(categoryArr)
    .execute();
}
