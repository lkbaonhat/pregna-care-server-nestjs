import { Test, TestingModule } from '@nestjs/testing';
import { MembershipPlanService } from './membership-plan.service';

describe('MembershipPlanService', () => {
  let service: MembershipPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembershipPlanService],
    }).compile();

    service = module.get<MembershipPlanService>(MembershipPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
