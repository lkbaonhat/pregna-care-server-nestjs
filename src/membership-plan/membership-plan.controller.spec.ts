import { Test, TestingModule } from '@nestjs/testing';
import { MembershipPlanController } from './membership-plan.controller';
import { MembershipPlanService } from './membership-plan.service';

describe('MembershipPlanController', () => {
  let controller: MembershipPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipPlanController],
      providers: [MembershipPlanService],
    }).compile();

    controller = module.get<MembershipPlanController>(MembershipPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
