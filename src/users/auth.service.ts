import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from './users.service';
import { ConfirmToken } from './types/confirm-token';
import { UserStatus } from './types/user-status';
import { EmailsService } from 'src/emails/emails.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: EmailsService,
  ) {}

  sendValidationEmail(id: string, email: string) {
    const token = this.jwtService.sign({ email, sub: id });
    const url = `${process.env.FRONTEND_URL}/users/validate?token=${token}`;

    this.mailService.sendMail(
      email,
      'Please confirm your email',
      'validation-email.ejs',
      { name: email, confirmationLink: url },
    );
  }

  async signUp(email: string, password: string) {
    // Check email in use
    const existedUser = await this.userService.findByEmail(email);
    if (existedUser) {
      throw new BadRequestException('Email is already in use when sign up');
    }

    // Create user
    const user = await this.userService.create(email, password);
    await user.save();

    // Send validation email
    this.sendValidationEmail(user._id.toString(), email);

    // TODO: Send response
  }

  async validateUser(token: string) {
    // check if the token is valid

    const decoded = this.jwtService.decode<ConfirmToken>(token);

    const user = await this.userService.findById(decoded.sub);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.email !== decoded.email) {
      throw new BadRequestException('Invalid token');
    }

    if (user.status === UserStatus.Active) {
      throw new BadRequestException('User already validated');
    }

    user.status = UserStatus.Active;
    await user.save();

    // TODO: Send response
  }
}
