import { Module } from '@nestjs/common';
import { MembershipPlanService } from './membership-plan.service';
import { MembershipPlanController } from './membership-plan.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MembershipPlan, MembershipPlanSchema } from './membership-plan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MembershipPlan.name, schema: MembershipPlanSchema },
    ]),
  ],
  controllers: [MembershipPlanController],
  providers: [MembershipPlanService],
  exports: [MembershipPlanService],
})
export class MembershipPlanModule {}
