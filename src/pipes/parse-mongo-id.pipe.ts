import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isObjectIdOrHexString } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string> {
  transform(value: string, _: ArgumentMetadata): string {
    if (!isObjectIdOrHexString(value))
      throw new BadRequestException('Invalid ID');
    return value;
  }
}
