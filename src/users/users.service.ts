import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './user.schema';
import { hashPasswordHelper, comparePasswordHelper } from 'src/utils/helper';
import { MembershipPlanTypes } from 'src/membership-plan/types/membership-plan';
import { MembershipDocument } from './membership.schema';
import { PaymentDocument } from 'src/payments/payment.schema';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { FetusDocument } from 'src/fetuses/entities/fetus.entity';

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

  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordMatch = await comparePasswordHelper(
      oldPassword,
      user.password,
    );
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

  async updateStripeCustomerId(userId: string, stripeCustomerId: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      stripeCustomerId,
    });
  }

  //* Avatar
  async updateAvatar(userId: string, avatarUrl: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Store previous avatar URL for cleanup if needed
    const previousAvatarUrl = user.avatarUrl;

    // Update user with new avatar URL
    user.avatarUrl = avatarUrl;
    await user.save();

    return {
      previousAvatarUrl,
      currentAvatarUrl: avatarUrl,
      user,
    };
  }

  async deleteAvatar(userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const previousAvatarUrl = user.avatarUrl;
    user.avatarUrl = '';
    await user.save();

    return {
      previousAvatarUrl,
      user,
    };
  }

  //* Membership
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

    try {
      user.fetuses[fetusIndex].name = fetus.name;
      user.fetuses[fetusIndex].dueDate = fetus.dueDate;
      user.fetuses[fetusIndex].gender = fetus.gender;
      await user.save();
    } catch (error) {
      console.log('Error update fetus in User: ', error);
    }
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

  async generateOTP(userId: string): Promise<string> {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Set OTP expiration to 10 minutes from now
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 10);

    // Save the hashed OTP and expiration to user
    await this.userModel.findByIdAndUpdate(userId, {
      otp: hashedOTP,
      otpExpires,
    });

    return otp;
  }

  async verifyOTP(userId: string, otp: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);

    if (!user || !user.otp || !user.otpExpires) {
      return false;
    }

    // Check if OTP has expired
    if (user.otpExpires < new Date()) {
      return false;
    }

    // Check if OTP matches
    return bcrypt.compare(otp, user.otp);
  }

  async clearOTP(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      otp: null,
      otpExpires: null,
    });
  }

  async incrementOtpResendCount(
    userId: string,
  ): Promise<{ count: number; resetDate: Date }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Reset counter if it's a new day
    if (!user.otpResendCountResetDate || user.otpResendCountResetDate < today) {
      user.otpResendCount = 1;
      user.otpResendCountResetDate = today;
      await user.save();
      return { count: 1, resetDate: today };
    }

    // Check if limit is reached
    if (user.otpResendCount >= 5) {
      throw new BadRequestException(
        'OTP resend limit reached for today. Please try again tomorrow.',
      );
    }

    // Increment counter
    user.otpResendCount += 1;
    await user.save();

    return {
      count: user.otpResendCount,
      resetDate: user.otpResendCountResetDate,
    };
  }

  async getOtpResendCount(
    userId: string,
  ): Promise<{ count: number; resetDate: Date }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      count: user.otpResendCount || 0,
      resetDate: user.otpResendCountResetDate || null,
    };
  }
}
