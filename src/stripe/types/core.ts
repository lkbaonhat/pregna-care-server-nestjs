import { MembershipPlan } from 'src/membership-plan/membership-plan.schema';

export type MembershipPlanIntentMetadata = {
  membership: Omit<MembershipPlan, 'isActive'>;
};
