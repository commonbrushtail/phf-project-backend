import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../interface/auth.interface';
import { AuthService } from '../auth.service';
import { RequestExtendExpress } from '../interface/auth.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refreshToken') {
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

    async validate(request: RequestExtendExpress, payload: JwtPayload) {
        const refreshToken = request?.signedCookies?.['refresh_token'];
        const userEmail = payload.sub;
        const user = await this.usersService.findUserByEmail(userEmail);
    
        if (!user) {
        throw new UnauthorizedException();
        }
    
        if (user.email_id && !user.is_email_verified) {
        throw new UnauthorizedException('Email is not verified');
        }
    
        // const refreshTokenExists = await this.authService.verifyRefreshToken(
        // refreshToken,
        // user,
        // );
    
        // if (!refreshTokenExists) {
        // throw new UnauthorizedException('Invalid refresh token');
        // }
    
        return user;
    }
 
}