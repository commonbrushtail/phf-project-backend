import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import {
  GoogleUserPayload,
  SocialUserPayload,
} from './interface/auth.interface';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private oauthClient: OAuth2Client;

  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
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

  async transformGooglePayload(payload: GoogleUserPayload) {
    const { email, given_name, family_name, picture } = payload;
    return {
      email,
      firstName: given_name,
      lastName: family_name,
      picture,
      provider: 'Google',
    };
  }
  async findOrCreateUser(userPayload: SocialUserPayload) {
    const { email, firstName, lastName, picture, provider } = userPayload;
    try {
      let user = await this.userRepository.findOne({
        where: { Email: userPayload.email },
      });

      if (!user) {
        const userData = {
          Email: email,
          Firstname: firstName,
          Lastname: lastName,
          Picture: picture,
          [`${provider}Id`]: true,
        };

        user = this.userRepository.create(userData);
        await this.userRepository.save(user);
      }

      return user;
    } catch (e) {
      console.log(e);
    }
  }

  async findUserByEmail(email: string) {
    try {
      return await this.userRepository.findOne({
        where: { Email: email },
      });
    } catch (e) {
      console.log(e);
    }
  }
}
