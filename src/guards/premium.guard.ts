import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { MembershipPlanTypes } from 'src/membership-plan/types/membership-plan';
import { AppRequest } from 'src/types/core';
import { UserRoles } from 'src/users/types/user-status';

@Injectable()
export class PremiumGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: AppRequest = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (
      user.role === UserRoles.Admin ||
      user.membership.plan === MembershipPlanTypes.Lifetime
    )
      return true;

    if (user.membership.plan === MembershipPlanTypes.Free) return false;

    // The remaining membership plan is 1 month => Check due date
    const dueDate = user.membership.dueDate;
    if (!dueDate) return false;

    const currentDate = new Date();
    if (currentDate > dueDate) return false;

    return true;
  }
}
