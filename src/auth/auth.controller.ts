import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';

import { LocalGuard } from 'src/guards/local.guard';

import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { Response } from 'src/types/core';
import { Public } from 'src/constants/core';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @Public()
  async createUser(@Body() body: CreateUserDto): Promise<Response> {
    const user = await this.authService.signUp(body.email, body.password);
    return { data: user, message: 'User created' };
  }

  @Post('signin')
  @Public()
  @UseGuards(LocalGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signIn(@Req() req: Request, @Body() _: CreateUserDto): Response {
    const result = this.authService.signin(req.user!);
    return { data: result, message: 'User signed in' };
  }
}
