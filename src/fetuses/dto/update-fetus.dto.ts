import { PartialType } from '@nestjs/swagger';
import { CreateFetusDto } from './create-fetus.dto';

export class UpdateFetusDto extends PartialType(CreateFetusDto) {}
