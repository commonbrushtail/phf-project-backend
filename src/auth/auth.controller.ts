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

      //let handle when user sign up first time first
      if (!userEmail) {
        const newGoogleUserPayload =
          this.authService.transformGooglePayload(payload);
        await this.userService.createUser(newGoogleUserPayload);
      }

      //if user found check if user has google auth method or other auth method
      if (userEmail) {
        const authMethod = await this.userService.getAuthMethods(userEmail);
        if (!authMethod.google) {
          throw new HttpException(
            'You have already used this email with another signup method',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  @Post('signup')
  async signup(@Body() authObject: EmailSignUpDto) {
    const { email } = authObject;
    console.log(authObject, 'from controller');
    try {
      const userEmail = await this.userService.findUserByEmail(email);

      if (userEmail) {
        const authMethod = await this.userService.getAuthMethods(userEmail);

        if (!authMethod.emailPassword) {
          throw new HttpException(
            'You have already used this email with another signup method',
            HttpStatus.UNAUTHORIZED,
          );
        } else {
          throw new HttpException(
            'You have already signup',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }

      const newUser =
        await this.userService.handleCreateUserByEmail(authObject);

      return newUser;
    } catch (e) {
      console.log(e);
    }
  }
}
