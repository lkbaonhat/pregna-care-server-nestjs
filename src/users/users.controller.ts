import { Controller, Delete, Get, Param, Req } from '@nestjs/common';

import { UsersService } from './users.service';

import { ParseMongoIdPipe } from 'src/pipes/parse-mongo-id.pipe';
import { Response } from 'src/types/core';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('self')
  getSelf(@Req() req: Request): Response {
    return { data: req.user };
  }

  @Get(':id')
  async getUser(@Param('id', ParseMongoIdPipe) id: string): Promise<Response> {
    const result = await this.usersService.findById(id);
    return { data: result };
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<Response> {
    const result = await this.usersService.delete(id);
    return { data: result };
  }
}
