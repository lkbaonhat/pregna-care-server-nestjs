import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { Response } from 'src/types/core';

@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AdminGuard)
  @Get()
  async findAll(): Promise<Response> {
    const data = await this.paymentsService.findAll();
    return { data };
  }
}
