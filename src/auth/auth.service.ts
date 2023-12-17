import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import {
  GoogleUserPayload,
  JwtPayload,
  SocialUserPayload,
  UserData,
  UserSessionData,
} from './interface/auth.interface';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private oauthClient: OAuth2Client;
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {
    this.oauthClient = new OAuth2Client(configService.get('GOOGLE_CLIENT_ID'));
  }

  async verifyGoogleAuthToken(idToken: string) {
    try {
      const ticket = await this.oauthClient.verifyIdToken({
        idToken,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });

      const userInfo = ticket.getPayload();

      return this.transformGooglePayload(userInfo);
    } catch (e) {
      console.log(e, 'error');
      return null;
    }
  }

  transformGooglePayload(payload: GoogleUserPayload): SocialUserPayload {
    const { email, given_name, family_name, picture } = payload;
    return {
      email,
      firstName: given_name,
      lastName: family_name,
      picture,
      provider: 'Google',
    };
  }

  generateUserData(user: User): UserData {
    return {
      email: user.Email,
      facebookId: user.FacebookId,
      googleId: user.GoogleId,
      emailId: user.EmailId,
      username: user.Username,
      isGuest: user.IsGuest,
    };
  }
  generateJwtPayload(email: UserData): JwtPayload {
    try {
      const payload: JwtPayload = {
        sub: email.email,
        iat: Date.now(),
      };
      return payload;
    } catch (e) {
      return e;
    }
  }

  async generateJwtToken(jwtPayload: JwtPayload): Promise<string> {
    try {
      const token = await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '30d',
      });
      return token;
    } catch (e) {
      return e;
    }
  }
  generateUserSessionData(userData: UserData, token: string): UserSessionData {
    return {
      userData,
      access_token: token,
    };
  }

  async createUserFromGooglePayload(payload: GoogleUserPayload): Promise<User> {
    const newUserData = this.transformGooglePayload(payload);
    return this.usersService.handleCreateUserByGoogle(newUserData);
  }

  async generateSessionDataForUser(user: User): Promise<UserSessionData> {
    const userData = this.generateUserData(user);
    const jwtPayload = this.generateJwtPayload(userData);
    const jwtToken = await this.generateJwtToken(jwtPayload);
    return this.generateUserSessionData(userData, jwtToken);
  }
}
