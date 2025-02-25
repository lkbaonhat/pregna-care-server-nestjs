import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { Response } from 'src/types/core';

@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @UseGuards(AdminGuard)
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  async findAll(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10
  ): Promise<Response> {
    const data = await this.paymentsService.findAll(page, limit);
    return data;
  }
}
