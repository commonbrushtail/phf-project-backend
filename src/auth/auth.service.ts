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
      id: user.Id,
      email: user.Email,
      facebookId: user.FacebookId,
      googleId: user.GoogleId,
      emailId: user.EmailId,
      username: user.Username,
      isGuest: user.IsGuest,
      isEmailVerified: user.IsEmailVerified,
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

  generateConfirmationEmailWithJWT(user: User): string {
    const confirmationToken = this.jwtService.sign(
      {
        email: user.Email,
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

    user.IsEmailVerified = true;
    const newUserData = await this.usersService.updateUser(user);

    return newUserData;
  }
}
