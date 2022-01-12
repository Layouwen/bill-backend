import { Controller } from '@nestjs/common';
import { RecordService } from './record.service';

@Controller('user')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}
}
