import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from './users.service';
import { UserStatus } from './types/user-status';
import { EmailsService } from 'src/emails/emails.service';
import { comparePasswordHelper } from 'src/utils/helper';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: EmailsService,
  ) {}

  async sendValidationEmail(id: string, email: string) {
    const token = this.jwtService.sign({ email, sub: id });
    const url = `${process.env.FRONTEND_URL}/users/validate?token=${token}`;

    await this.mailService.sendMail(
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
      if (existedUser.status === UserStatus.Registered) {
        throw new BadRequestException(
          'User already registered, please validate email',
        );
      }
      throw new BadRequestException('Email is already in use');
    }

    // Create user
    const user = await this.userService.create(email, password);
    await user.save();

    // Send validation email
    await this.sendValidationEmail(user._id.toString(), email);

    return { id: user._id.toString(), email: user.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await comparePasswordHelper(password, user.password);

    if (!isValid) {
      throw new BadRequestException('Invalid password');
    }

    if (user.status !== UserStatus.Active) {
      throw new BadRequestException('User is not active');
    }

    return this.jwtService.sign({ email, sub: user._id });
  }
}
