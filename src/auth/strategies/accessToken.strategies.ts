import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../interface/auth.interface';
import { AuthService } from '../auth.service';
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'AccessToken') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.signedCookies?.['access_token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
  async validate(payload: JwtPayload) {
    const userId = payload.sub;
    const user = await this.usersService.findUserById(userId);

    console.log(payload)

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.email_id && !user.is_email_verified) {
      throw new UnauthorizedException('Email is not verified');
    }
    

    return user;
  }
}
