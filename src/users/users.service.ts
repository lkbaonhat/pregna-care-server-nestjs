import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private repo: Model<User>) {}
}
