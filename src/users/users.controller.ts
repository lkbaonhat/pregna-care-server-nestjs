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
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { ParseMongoIdPipe } from 'src/pipes/parse-mongo-id.pipe';
import { Response } from 'src/types/core';
import { Request } from 'express';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AdminGuard)
  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Response> {
    const result = await this.usersService.findAll(Number(page), Number(limit));
    return { data: result };
  }

  @UseGuards(AdminGuard)
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

  @UseGuards(AdminGuard)
  @Get(':id')
  async getUser(@Param('id', ParseMongoIdPipe) id: string): Promise<Response> {
    const result = await this.usersService.findById(id);
    return { data: result };
  }

  // TODO: Add User route to update only password
  @Put('password')
  async updatePassword(@Req() req: Request, @Body() body: UpdatePasswordDto): Promise<Response> {
    const user = req.user as UserDocument;
    const result = await this.usersService.updatePassword(user.id, body.oldPassword, body.newPassword);
    return { data: result, message: 'Password updated' };
  }

  // TODO: Add User route to upload avatar
  
  // TODO: Add User route to update bloodType, nationality, phoneNumber, firstName, lastName, dateOfBirth
  @Put('profile')
  async updateProfile(@Req() req: Request, @Body() body: UpdateProfileDto): Promise<Response> {
    const user = req.user as UserDocument;
    const result = await this.usersService.updateProfile(user.id, body);
    return { data: result };
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  async updateUser(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() body: Partial<User>,
  ): Promise<Response> {
    const result = await this.usersService.update(id, body);
    return { data: result };
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<Response> {
    const result = await this.usersService.delete(id);
    return { data: result };
  }
}
