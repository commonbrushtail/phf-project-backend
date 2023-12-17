import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GoogleAuthDto, EmailSignUpDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}
  @Post('google')
  async recieveToken(@Body() authObject: GoogleAuthDto) {
    try {
      const payload = await this.authService.verifyGoogleAuthToken(
        authObject.credential,
      );

      if (!payload) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      const userEmail = await this.userService.findUserByEmail(payload.email);

      if (userEmail) {
        const authMethod = await this.userService.getAuthMethods(userEmail);
        if (!authMethod.google) {
          throw new HttpException(
            'You have already used this email with another signup method',
            HttpStatus.UNAUTHORIZED,
          );
        }
        if (authMethod.google) {
          //maybe redirect to login method later
          throw new HttpException(
            'You already signup with google, please sign in',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }

      const newUser =
        await this.authService.createUserFromGooglePayload(payload);

      const userSessionData =
        this.authService.generateSessionDataForUser(newUser);

      return userSessionData;
    } catch (e) {
      return e;
    }
  }

  @Post('signup')
  async signup(@Body() authObject: EmailSignUpDto) {
    const { email } = authObject;
    console.log(authObject);
    try {
      const userEmail = await this.userService.findUserByEmail(email);

      if (userEmail) {
        const authMethod = await this.userService.getAuthMethods(userEmail);
        if (!authMethod.email) {
          throw new HttpException(
            'You have already used this email with another signup method',
            HttpStatus.UNAUTHORIZED,
          );
        }

        if (authMethod.email) {
          throw new HttpException(
            'You have already used this email to signup',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
      const newUser =
        await this.userService.handleCreateUserByEmailPassword(authObject);

      const userSessionData =
        this.authService.generateSessionDataForUser(newUser);

      return userSessionData;
    } catch (e) {
      return e;
    }
  }
}
