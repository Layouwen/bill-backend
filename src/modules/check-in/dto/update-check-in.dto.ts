import { PartialType } from '@nestjs/swagger';
import { CreateCheckInDto } from './create-check-in.dto';

export class UpdateCheckInDto extends PartialType(CreateCheckInDto) {}
