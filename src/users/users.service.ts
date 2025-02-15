import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './user.schema';
import { hashPasswordHelper } from 'src/utils/helper';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  create(email: string, password: string) {
    const user = new this.userModel({ email, password });
    return user.save();
  }

  findById(id: string) {
    return this.userModel.findById(id);
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async update(id: string, attrs: Partial<User>) {
    // find user to update
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found to update');
    // update user
    Object.assign(user, attrs);
    return user.save();
  }

  async delete(id: string) {
    // find user to delete
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found to delete');
    // delete user
    return user.deleteOne();
  }

  async updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await hashPasswordHelper(newPassword);
    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
  }
}
