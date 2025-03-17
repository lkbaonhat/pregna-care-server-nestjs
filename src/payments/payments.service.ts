import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Payment, PaymentDocument } from './payment.schema';
import { PaymentIntentStatus } from './types/payment-intent-status';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) { }

  async findAll(page: number, limit: number) {
    const [data, total] = await Promise.all([
      this.paymentModel.find().skip((page - 1) * limit).limit(limit),
      this.paymentModel.countDocuments()
    ]);

    return {
      data: {
        data,
        pagination: {
          total,
          page,
          limit,
          nextPage: total > page * limit ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null,
        },
      },
    };
  }

  async findById(id: string) {
    return this.paymentModel.findById(id);
  }

  async findByPaymentIntentId(paymentIntentId: string) {
    return this.paymentModel.findOne({ stripeId: paymentIntentId });
  }

  async findByUser(userId: string) {
    return this.paymentModel.find({ userId });
  }

  async create(data: Partial<Payment>) {
    return this.paymentModel.create(data);
  }

  async updateStatus(payment: PaymentDocument, status: PaymentIntentStatus) {
    payment.status = status;
    return payment.save();
  }
}
