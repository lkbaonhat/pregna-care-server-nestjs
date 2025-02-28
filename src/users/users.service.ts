import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './user.schema';
import { hashPasswordHelper, comparePasswordHelper } from 'src/utils/helper';
import { MembershipPlanTypes } from 'src/membership-plan/types/membership-plan';
import { MembershipDocument } from './membership.schema';
import { PaymentDocument } from 'src/payments/payment.schema';
<<<<<<< HEAD
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { CreateUserDto } from './dtos/create-user.dto';
=======
import { FetusDocument } from 'src/fetuses/entities/fetus.entity';
>>>>>>> 0e15c08c3553ada128c43d191cd925b2a77ebde2

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

  async updateProfile(userId: string, profileData: UpdateProfileDto) {
    const user = await this.findById(userId);
      if (!user) {
    throw new NotFoundException('User not found');
  }
    Object.assign(user, profileData);
    return user.save();
  }

  async updatePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordMatch = await comparePasswordHelper(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('Old password is incorrect');
    } 
    const hashedPassword = await hashPasswordHelper(newPassword);
    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
  }

    async resetPassword(userId: string, newPassword: string) {
    const hashedPassword = await hashPasswordHelper(newPassword);
    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
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

<<<<<<< HEAD
=======
  async updateStripeCustomerId(userId: string, stripeCustomerId: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      stripeCustomerId,
    });
  }

  async updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await hashPasswordHelper(newPassword);
    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
  }

>>>>>>> 0e15c08c3553ada128c43d191cd925b2a77ebde2
  async updateMembership(user: UserDocument, plan: MembershipPlanTypes) {
    const now = Math.round(new Date().getTime() / 1000);
    let newDueDate: number | null = null;
    if (plan === MembershipPlanTypes.Freemium)
      newDueDate = now + 60 * 60 * 24 * 3; // 3 days
    if (plan === MembershipPlanTypes.OneMonth)
      newDueDate = now + 60 * 60 * 24 * 30; // 30 days
    user.membership = {
      plan,
      dueDate: newDueDate,
    } as MembershipDocument;

    await user.save();

    return user;
  }

  async cancelMembership(user: UserDocument) {
    await this.userModel.findByIdAndUpdate(user._id, {
      membership: {
        plan: MembershipPlanTypes.Free,
        dueDate: null,
      },
    });
  }

  async addTransaction(user: UserDocument, payment: PaymentDocument) {
    delete payment.userId;
    // Add transaction to user
    user.transactions.push(payment);
    return user.save();
  }

  async updateTransaction(user: UserDocument, payment: PaymentDocument) {
    // Find and update transaction
    const transactionIndex = user.transactions.findIndex(
      (transaction) => transaction._id.toString() === payment._id.toString(),
    );
    if (transactionIndex === -1) {
      throw new NotFoundException('Transaction not found');
    }

    delete payment.userId;
    user.transactions[transactionIndex] = payment;
    return user.save();
  }

  async addFetus(user: UserDocument, fetus: FetusDocument) {
    delete fetus.userId;
    user.fetuses.push(fetus);
    return await user.save();
  }

  async updateFetus(user: UserDocument, fetus: FetusDocument) {
    const fetusIndex = user.fetuses.findIndex(
      (userFetus) => userFetus._id.toString() === fetus._id.toString(),
    );
    if (fetusIndex === -1) {
      throw new NotFoundException('Fetus not found');
    }

    delete fetus.userId;
    user.fetuses[fetusIndex] = fetus;
    return user.save();
  }

  async softDeleteFetus(user: UserDocument, fetusId: string) {
    const fetusIndex = user.fetuses.findIndex(
      (fetus) => fetus._id.toString() === fetusId,
    );
    if (fetusIndex === -1) {
      throw new NotFoundException('Fetus not found');
    }

    user.fetuses[fetusIndex].isDeleted = true;
    return user.save();
  }

  async hardDeleteFetus(user: UserDocument, fetusId: string) {
    const fetusIndex = user.fetuses.findIndex(
      (fetus) => fetus._id.toString() === fetusId,
    );
    if (fetusIndex === -1) {
      throw new NotFoundException('Fetus not found');
    }

    user.fetuses.splice(fetusIndex, 1);
    return user.save();
  }
}
