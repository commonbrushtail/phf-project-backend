import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../interface/auth.interface';
import { AuthService } from '../auth.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
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
    const userEmail = payload.sub;
    const user = await this.usersService.findUserByEmail(userEmail);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.EmailId && !user.IsEmailVerified) {
      throw new UnauthorizedException('Email is not verified');
    }

    // const userData = this.authService.generateUserData(user);
    return user;
  }
}
