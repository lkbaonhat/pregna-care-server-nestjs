import { PartialType } from '@nestjs/swagger';
import { CreateFetusStandardDto } from './create-fetus-standard.dto';

export class UpdateFetusStandardDto extends PartialType(
  CreateFetusStandardDto,
) {}
