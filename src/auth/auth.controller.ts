import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';

import { LocalGuard } from 'src/guards/local.guard';

import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { Response } from 'src/types/core';
import { Public } from 'src/constants/core';
import { ConfirmEmailDto } from './dtos/confirm-email.dto';
import { GoogleAuthGuard } from 'src/guards/google-auth/google-auth.guard';
import {
  RequestResetPasswordDto,
  ResetPasswordDto,
} from './dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @Public()
  async createUser(@Body() body: CreateUserDto): Promise<Response> {
    const user = await this.authService.signUp(body.email, body.password);
    return { data: user, message: 'User created' };
  }

  @Post('confirm-email')
  @Public()
  async confirmEmail(@Body() body: ConfirmEmailDto): Promise<Response> {
    const email = this.authService.decodeConfirmationToken(body.token);
    const result = await this.authService.validateEmail(email);
    return { data: result, message: 'Email confirmed' };
  }

  // TODO: Implement resend email confirmation

  @Post('signin')
  @Public()
  @UseGuards(LocalGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signIn(@Req() req: Request, @Body() _: CreateUserDto): Response {
    const result = this.authService.signin(req.user!);
    return { data: result, message: 'User signed in' };
  }

  //Login with google
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  googleCallBack(@Req() req, @Res() res) {
    const response = this.authService.signin(req.user.id);
    res.redirect(`http://localhost:3000?accessToken=${response.accessToken}`);
    return { data: null };
  }

  @Post('request-reset-password')
  @Public()
  async requestResetPassword(
    @Body() body: RequestResetPasswordDto,
  ): Promise<Response> {
    const result = await this.authService.requestPasswordReset(body.email);
    return { data: result, message: 'Reset password email sent' };
  }

  @Post('reset-password')
  @Public()
  async resetPassword(@Body() body: ResetPasswordDto): Promise<Response> {
    const result = await this.authService.resetPassword(
      body.token,
      body.newPassword,
    );
    return { data: result, message: 'Password reset successful' };
  }
}
