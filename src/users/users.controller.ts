import { Body, Controller, Post } from '@nestjs/common';

import { UsersService } from './users.service';
import { AuthService } from './auth.service';
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
  signIn(@Body() body: CreateUserDto) {}
}
