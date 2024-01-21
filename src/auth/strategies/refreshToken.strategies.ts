import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../interface/auth.interface';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'RefreshToken',
) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.signedCookies?.['refresh_token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    const refreshToken = request?.signedCookies?.['refresh_token'];
    const userId = payload.sub;
    const user = await this.usersService.findUserById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const refreshTokenExists = await this.authService.verifyRefreshToken(
    refreshToken,
    user,
    );

    if (!refreshTokenExists) {
    throw new UnauthorizedException('Invalid refresh token');
    }

    return user;
  }
}
