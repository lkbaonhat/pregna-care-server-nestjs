import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { AuthService } from './auth.service';

import { ParseMongoIdPipe } from 'src/pipes/parse-mongo-id.pipe';

import { LocalGuard } from 'src/guards/local.guard';

import { CreateUserDto } from './dtos/create-user.dto';
import { Response } from 'src/types/core';

@Controller()
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('auth/signup')
  async createUser(@Body() body: CreateUserDto): Promise<Response> {
    const user = await this.authService.signUp(body.email, body.password);
    return { data: user, message: 'User created' };
  }

  @Post('auth/signin')
  @UseGuards(LocalGuard)
  signIn(@Body() body: CreateUserDto) {}

  @Get('users/:id')
  async getUser(@Param('id', ParseMongoIdPipe) id: string): Promise<Response> {
    const result = await this.usersService.findById(id);
    return { data: result, message: null };
  }

  @Delete('users/:id')
  async deleteUser(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<Response> {
    const result = await this.usersService.delete(id);
    return { data: result, message: null };
  }
}
