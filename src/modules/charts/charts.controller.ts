import {Controller, Request, Get, Post, Body, Patch, Param, Delete, UseGuards, Query} from '@nestjs/common';
import { ChartsService } from './charts.service';
import { CreateChartDto } from './dto/create-chart.dto';
import { UpdateChartDto } from './dto/update-chart.dto';
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@ApiTags('charts')
@UseGuards(JwtAuthGuard)
@Controller('charts')
@ApiBearerAuth('Token')
export class ChartsController {
  constructor(private readonly chartsService: ChartsService) {}

  @Post()
  create(@Body() createChartDto: CreateChartDto) {
    return this.chartsService.create(createChartDto);
  }

  @Get()
  @ApiOperation({summary:'图表数据'})
  findAll(@Request() req,@Query() query:any) {
    console.log(req,'req图表')
    console.log(query,'query')
    return this.chartsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chartsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChartDto: UpdateChartDto) {
    return this.chartsService.update(+id, updateChartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chartsService.remove(+id);
  }
}
