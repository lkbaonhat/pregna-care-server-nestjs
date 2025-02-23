import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { ParseMongoIdPipe } from 'src/pipes/parse-mongo-id.pipe';
import { Response } from 'src/types/core';
import { Request } from 'express';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Response> {
    const result = await this.usersService.findAll(Number(page), Number(limit));
    return { data: result };
  }

  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<Response> {
    const result = await this.usersService.createUserByAdmin(
      body.email,
      body.password,
    );
    return { data: result };
  }

  @Get('self')
  getSelf(@Req() req: Request): Response {
    return { data: req.user };
  }

  @Delete('membership')
  async cancelMembership(@Req() req: Request): Promise<Response> {
    const user = req.user as UserDocument;
    const result = await this.usersService.cancelMembership(user);
    return { data: result };
  }

  @Get(':id')
  async getUser(@Param('id', ParseMongoIdPipe) id: string): Promise<Response> {
    const result = await this.usersService.findById(id);
    return { data: result };
  }

  // TODO: Add another route to update only password
  // TODO: Prevent updating email, password, membership, stripeCustomerId,
  // role, status, transactions
  @Put(':id')
  async updateUser(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() body: Partial<User>,
  ): Promise<Response> {
    const result = await this.usersService.update(id, body);
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
