import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import {
  GoogleAuthDto,
  EmailSignUpDto,
  EmailSignInDto,
  EmailConfirmDto,
} from './dto/auth.dto';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { Public } from 'src/decorator/isPublic';
import { MailService } from 'src/mail/mail.service';
import { Response } from 'express';
import { use } from 'passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private mailService: MailService,
  ) {}

  @Public()
  @Post('google')
  async recieveToken(
    @Body() authObject: GoogleAuthDto,
    @Res() response: Response,
  ) {
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
        await this.authService.generateSessionDataForUser(newUser);

      const responseObject = this.authService.setAccessTokenCookie(
        response,
        userSessionData.access_token,
      );

      return responseObject.send({
        status: 'success',
        message: 'Google signup successfully.',
        data: userSessionData.userData,
      });
    } catch (e) {
      return e;
    }
  }

  @Public()
  @Post('signup')
  async signup(@Body() authObject: EmailSignUpDto, @Res() Response: Response) {
    const { email } = authObject;
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
        await this.authService.generateSessionDataForUser(newUser);

      const confirmEmailToken =
        this.authService.generateConfirmationEmailWithJWT(newUser);

      await Promise.all([
        this.mailService.sendConfirmationEmail(
          userSessionData.userData.email,
          confirmEmailToken,
        ),
      ]);

      const responseObject = this.authService.setAccessTokenCookie(
        Response,
        userSessionData.access_token,
      );

      return responseObject.send({
        status: 'success',
        message: 'Email signup successfully.',
        data: userSessionData.userData,
      });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Public()
  @Post('email-login')
  async emailLogin(
    @Body() authObject: EmailSignInDto,
    @Res() response: Response,
  ) {
    try {
      const user = await this.userService.findUserByEmail(authObject.email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordMatch = await this.userService.comparePassword(
        authObject.password,
        user.Password,
      );

      if (!passwordMatch) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const authMethod = await this.userService.getAuthMethods(user);
      if (!authMethod.email) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const userSessionData =
        await this.authService.generateSessionDataForUser(user);

      const responseObject = this.authService.setAccessTokenCookie(
        response,
        userSessionData.access_token,
      );

      return responseObject.send({
        status: 'success',
        message: 'Email login successfully.',
        data: userSessionData.userData,
      });
    } catch (e) {
      return e;
    }
  }

  @Public()
  @Post('confirm-email')
  async confirmEmail(
    @Body() emailConfirmDto: EmailConfirmDto,
    @Res() response: Response,
  ) {
    const { token } = emailConfirmDto;

    try {
      const updatedUser = await this.authService.handleConfirmEmail(token);
      const userSessionData =
        await this.authService.generateSessionDataForUser(updatedUser);

      const responseObject = this.authService.setAccessTokenCookie(
        response,
        userSessionData.access_token,
      );

      return responseObject.send({
        status: 'success',
        data: userSessionData.userData,
        message: 'Email confirm successfully.',
      });
    } catch (e) {
      new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post('guest-login')
  async guestLogin(@Res() response: Response) {
    try {
      console.log(response);
      const guestUser = await this.userService.handleCreateGuestUser();
      const userSessionData =
        await this.authService.generateSessionDataForUser(guestUser);

      const responseObject = this.authService.setAccessTokenCookie(
        response,
        userSessionData.access_token,
      );

      return responseObject.send({
        status: 'success',
        message: 'Guest login successfully.',
        data: userSessionData.userData,
      });
    } catch (e) {
      return e;
    }
  }
}
