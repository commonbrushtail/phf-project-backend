import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategies';
import { MailService } from 'src/mail/mail.service';
import { NodemailerProvider } from 'src/mail/nodemailer.provider';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategies';
@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    AccessTokenStrategy,
    MailService,
    NodemailerProvider,
    RefreshTokenStrategy
  ],
})
export class AuthModule {}
