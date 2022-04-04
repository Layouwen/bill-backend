import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { success } from '../../utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckInService } from './check-in.service';

@ApiTags('check_in')
@ApiBearerAuth('Token')
@Controller('check_in')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '打卡' })
  async create(@Req() req) {
    await this.checkInService.create(req.user.id);
    return success('打卡成功');
  }

  //
  // @Get()
  // findAll() {
  //   return this.checkInService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.checkInService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCheckInDto: UpdateCheckInDto) {
  //   return this.checkInService.update(+id, updateCheckInDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.checkInService.remove(+id);
  // }
}
