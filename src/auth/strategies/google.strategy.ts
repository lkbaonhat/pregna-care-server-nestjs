import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import googleAuthConfig from '../config/google-auth.config';
import { ConfigType } from '@nestjs/config';
import { VerifiedCallback } from 'passport-jwt';
import { AuthService } from '../auth.service';
import * as crypto from 'crypto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleAuthConfig.KEY)
    private googleConfig: ConfigType<typeof googleAuthConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: googleConfig.clientId as string,
      clientSecret: googleConfig.clientSecret as string,
      callbackURL: googleConfig.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifiedCallback,
  ) {
    const password = crypto.randomBytes(16).toString('hex');
    const user = await this.authService.validateGoogleUser({
      email: profile.emails[0].value,
      password: password,
    });
    done(null, user);
  }
}
