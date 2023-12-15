import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GoogleAuthDto, EmailSignUpDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('google')
  async recieveToken(@Body() authObject: GoogleAuthDto) {
    try {
      const payload = await this.authService.verifyGoogleAuthToken(
        authObject.credential,
      );

      if (!payload) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      const user = await this.authService.findOrCreateUser(payload);
      console.log(user);
    } catch (e) {
      console.log(e);
    }
  }

  @Post('signup')
  async signup(@Body() authObject: EmailSignUpDto) {
    try {
      const user = await this.authService.findUserByEmail(authObject.email);
      console.log(user);
      if (user) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
