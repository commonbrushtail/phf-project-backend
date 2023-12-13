import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
@Injectable()
export class AuthService {
  private oauthClient: OAuth2Client;

  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.oauthClient = new OAuth2Client(configService.get('GOOGLE_CLIENT_ID'));
  }

  async verifyGoogleAuthToken(idToken: string) {
    try {
      const ticket = await this.oauthClient.verifyIdToken({
        idToken,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });

      return ticket.getPayload();
    } catch (e) {
      console.log(e);
    }
  }
}
