import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MembershipPlanService } from './membership-plan.service';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { Response } from 'src/types/core';
import { AdminGuard } from 'src/guards/admin.guard';
import { ParseMongoIdPipe } from 'src/pipes/parse-mongo-id.pipe';
import { ApiBody } from '@nestjs/swagger';
import { MembershipPlan } from './membership-plan.schema';

@Controller('admin/membership-plan')
export class MembershipPlanController {
  constructor(private readonly membershipPlanService: MembershipPlanService) {}

  @UseGuards(AdminGuard)
  @Post()
  async create(
    @Body() createMembershipPlanDto: CreateMembershipPlanDto,
  ): Promise<Response> {
    const membershipPlan = await this.membershipPlanService.create(
      createMembershipPlanDto,
    );
    return { data: membershipPlan, message: 'Membership plan created' };
  }

  @Get()
  async findAll(): Promise<Response> {
    const membershipPlans = await this.membershipPlanService.findAll();
    return { data: membershipPlans };
  }

  @Get(':id')
  async findOne(@Param('id', ParseMongoIdPipe) id: string): Promise<Response> {
    const membershipPlan = await this.membershipPlanService.findOne(id);
    return { data: membershipPlan };
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiBody({ type: UpdateMembershipPlanDto })
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateMembershipPlanDto: Partial<MembershipPlan>,
  ): Promise<Response> {
    const membershipPlan = await this.membershipPlanService.update(
      id,
      updateMembershipPlanDto,
    );
    return { data: membershipPlan, message: 'Membership plan updated' };
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id', ParseMongoIdPipe) id: string): Promise<Response> {
    const membershipPlan = await this.membershipPlanService.remove(id);
    return { data: membershipPlan, message: 'Membership plan deleted' };
  }
}
