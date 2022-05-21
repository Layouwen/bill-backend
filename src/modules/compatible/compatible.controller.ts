import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { success, throwFail } from '../../utils';
import { UserService } from '../user/user.service';
import { CompatibleCategoryDto } from './dto/compatible.dto';

@ApiTags('compatible')
@Controller('compatible')
export class CompatibleController {
  constructor(private userService: UserService) {}

  @Post('category')
  async compatibleCategory(
    @Body() compatibleCategoryDto: CompatibleCategoryDto,
  ) {
    const { id, secretKey } = compatibleCategoryDto;
    if (secretKey !== 'layouwen') throwFail('秘钥错误');
    await this.userService.createDefaultCategory(id + '');
    return success('操作成功');
  }
}
