import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

  async createUserByAdmin(email: string, password: string) {
    // Check email in use
    const existedUser = await this.findByEmail(email);
    if (existedUser) {
      throw new BadRequestException('Email is already in use');
    }

    //Create new user
    const newUser = new this.userModel({ email, password });
    await newUser.save();
    return newUser;
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const users = await this.userModel.find().skip(skip).limit(limit).exec();
    const total = await this.userModel.countDocuments();

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
