import { BadRequestException, Injectable } from '@nestjs/common';
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
  RefreshTokenPayload,
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
    this.oauthClient = new OAuth2Client(
      configService.get('GOOGLE_CLIENT_ID'),
      configService.get('GOOGLE_SECRET'),
      configService.get('GOOGLE_REDIRECT_URL'),
    );
  }

  async verifyGoogleAuthToken(idToken: string) {
    try {
      const tokens = await this.getTokensFromClientGoogleCode(idToken);
      const { id_token } = tokens.tokens;
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: id_token,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });
      const userInfo = ticket.getPayload();
      console.log(userInfo, 'userInfo');
      return this.transformGooglePayload(userInfo);
    } catch (e) {
      console.log(e, 'error');
      return null;
    }
  }

  async getTokensFromClientGoogleCode(code: string) {
    const tokens = await this.oauthClient.getToken(code);
    return tokens;
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
      id: user.id,
      email: user.email,
      facebookId: user.facebook_id,
      googleId: user.google_id,
      emailId: user.email_id,
      username: user.username,
      isGuest: user.is_guest,
      isEmailVerified: user.is_email_verified,
    };
  }
  generateJwtPayload(user: UserData): JwtPayload {
    try {
      const payload: JwtPayload = {
        sub: user.email,
        id: user.id,
        iat: Date.now(),
      };
      return payload;
    } catch (e) {
      return e;
    }
  }

  async generateAccessToken(jwtPayload: JwtPayload): Promise<string> {
    try {
      const token = await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '15m',
      });
      return token;
    } catch (e) {
      return e;
    }
  }

  async generateRefreshToken(jwtPayload: JwtPayload): Promise<string> {
    try {
      const token = await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      });
      return token;
    } catch (e) {
      return e;
    }
  }

  generateUserSessionData(
    userData: UserData,
    accessToken: string,
    refreshToken: string,
  ): UserSessionData {
    return {
      userData,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async createUserFromGooglePayload(payload: GoogleUserPayload): Promise<User> {
    const newUserData = this.transformGooglePayload(payload);
    return this.usersService.handleCreateUserByGoogle(newUserData);
  }

  async generateSessionDataForUser(user: User): Promise<UserSessionData> {
    const initialUserData = this.generateUserData(user);

    const jwtPayload = this.generateJwtPayload(initialUserData);

    const accessToken = await this.generateAccessToken(jwtPayload);
    const refreshToken = await this.generateRefreshToken(jwtPayload);

    const updatedUser = await this.usersService.updateRefreshToken(
      user,
      refreshToken,
    );

    const newUserData = this.generateUserData(updatedUser);

    return this.generateUserSessionData(newUserData, accessToken, refreshToken);
  }

  generateConfirmationEmailWithJWT(user: User): string {
    const confirmationToken = this.jwtService.sign(
      {
        email: user.email,
      },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '3d',
      },
    );

    return confirmationToken;
  }

  async handleConfirmEmail(token: string): Promise<User> {
    let decodedToken;
    try {
      decodedToken = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (e) {
      throw new BadRequestException('Invalid or expired token');
    }

    const user = await this.usersService.findUserByEmail(decodedToken.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.is_email_verified = true;
    const newUserData = await this.usersService.updateUser(user);

    return newUserData;
  }
}
