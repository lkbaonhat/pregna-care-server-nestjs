import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EmailsService } from 'src/emails/emails.service';
import { UsersService } from 'src/users/users.service';

import { comparePasswordHelper } from 'src/utils/helper';
import { UserStatus } from 'src/users/types/user-status';
import { UserDocument } from 'src/users/user.schema';
import { ConfigService } from '@nestjs/config';
import { ConfirmToken } from 'src/users/types/confirm-token';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: EmailsService,
  ) {}

  async sendValidationEmail(id: string, email: string) {
    const token = this.jwtService.sign(
      { email, sub: id },
      {
        secret: this.configService.get('JWT_VERIFY_SECRET'),
        expiresIn: '1h',
      },
    );
    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}/users/validate-email?token=${token}`;

    await this.mailService.sendMail(
      email,
      'Please confirm your email',
      'validation-email.ejs',
      { name: email, confirmationLink: url },
    );

    return token;
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
    const token = await this.sendValidationEmail(user._id.toString(), email);

    return {
      id: user._id.toString(),
      email: user.email,
      // TODO: delete this when production
      confirmationToken: token,
    };
  }

  signin(user: Partial<UserDocument>) {
    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      userId: user._id,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await comparePasswordHelper(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid password');
    }

    if (user.status !== UserStatus.Active) {
      throw new UnauthorizedException('User is not active');
    }

    return user;
  }

  async validateUserById(id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== UserStatus.Active) {
      throw new UnauthorizedException('User is not active');
    }

    return user;
  }

  async validateEmail(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.status = UserStatus.Active;
    await user.save();

    // Send a JWT token for the user to immediately sign in
    return this.signin(user);
  }

  decodeConfirmationToken(token: string) {
    try {
      const payload = this.jwtService.verify<ConfirmToken>(token, {
        secret: this.configService.get('JWT_VERIFY_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async sendResetPasswordEmail(id: string, email: string) {
    const token = this.jwtService.sign(
      { email, sub: id },
      {
        secret: this.configService.get('JWT_VERIFY_SECRET'),
        expiresIn: '1h',
      },
    );
    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}/reset-password?token=${token}`;

    await this.mailService.sendMail(
      email,
      'Reset Your Password',
      'reset-password-email.ejs',
      { name: email, resetLink: url },
    );

    return token;
  }

  async requestPasswordReset(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Send reset password email
    const token = await this.sendResetPasswordEmail(user._id.toString(), email);

    return {
      message: 'Password reset email sent',
      // TODO: remove this in production
      resetToken: token,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFY_SECRET'),
      });

      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Update password
      await this.userService.updatePassword(user._id.toString(), newPassword);

      return {
        message: 'Password reset successful',
      };
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Reset password token expired');
      }
      throw new BadRequestException('Invalid reset password token');
    }
  }
}
