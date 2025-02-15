import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MembershipPlan } from './membership-plan.schema';

@Injectable()
export class MembershipPlanService {
  constructor(@InjectModel('MembershipPlan') private membershipPlanModel: Model<MembershipPlan>) {}
  create(createMembershipPlanDto: CreateMembershipPlanDto) {
    const membershipPlan = new this.membershipPlanModel(createMembershipPlanDto);
    return membershipPlan.save();
  }

  findAll() {
    return this.membershipPlanModel.find();
  }

  findOne(id: number) {
    return this.membershipPlanModel.findById(id);
  }

  async update(id: string, updateMembershipPlanDto: Partial<MembershipPlan>) {
    const membershipPlan = await this.membershipPlanModel.findById(id);
    if (!membershipPlan) throw new NotFoundException('Membership plan not found');
    Object.assign(membershipPlan, updateMembershipPlanDto);
    return membershipPlan.save();
  }

  async remove(id: string) {
    const membershipPlan = await this.membershipPlanModel.findById(id);
    if (!membershipPlan) throw new NotFoundException('Membership plan not found');
    return membershipPlan.deleteOne();
  }
}
