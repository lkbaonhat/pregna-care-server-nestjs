import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Payment } from './payment.schema';
import { UserDocument } from 'src/users/user.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) {}

  async findAll() {
    return this.paymentModel.find();
  }

  async findById(id: string) {
    return this.paymentModel.findById(id);
  }

  async findByUser(userId: string) {
    return this.paymentModel.find({ user: userId });
  }

  async create(user: Partial<UserDocument>) {
    return this.paymentModel.create({
      user,
    });
  }
}
