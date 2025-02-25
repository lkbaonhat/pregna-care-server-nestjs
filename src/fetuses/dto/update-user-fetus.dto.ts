import { PartialType } from '@nestjs/swagger';
import { CreateUserFetusDto } from './create-user-fetus.dto';

export class UpdateUserFetusDto extends PartialType(CreateUserFetusDto) {}
