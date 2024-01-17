import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Public } from 'src/decorator/isPublic';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import {
  EmailConfirmDto,
  EmailSignInDto,
  EmailSignUpDto,
  GoogleAuthDto,
} from './dto/auth.dto';
import { UserWithRequest } from './interface/auth.interface';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private mailService: MailService,
  ) {}

  @Public()
  @Post('google')
  async recieveToken(@Body() authObject: GoogleAuthDto) {
    try {
      const payload = await this.authService.verifyGoogleAuthToken(
        authObject.credential,
      );

      if (!payload) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      const user = await this.userService.findUserByEmail(payload.email);
      console.log(user)
      if (user) {
        const authMethod = await this.userService.getAuthMethods(user);
        if (!authMethod.google) {
          throw new HttpException(
            'You have already used this email with another signup method',
            HttpStatus.UNAUTHORIZED,
          );
        }
        if (authMethod.google) {
          const userSessionData =
            await this.authService.generateSessionDataForUser(user);
          return {
            status: 'success',
            data: userSessionData,
            message: 'Google login successfully.',
          };
        }
      }

      const newUser =
        await this.authService.createUserFromGooglePayload(payload);

      const userSessionData =
        await this.authService.generateSessionDataForUser(newUser);

      return {
        status: 'success',
        data: userSessionData,
        message: 'Google signup successfully.',
      };
    } catch (e) {
      return e;
    }
  }

  @Public()
  @Post('signup')
  async signup(@Body() authObject: EmailSignUpDto) {
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

      console.log('Email sent');
      return {
        status: 'success',
        data: userSessionData,
        message: 'Email signup successfully.',
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Public()
  @Post('email-login')
  async emailLogin(@Body() authObject: EmailSignInDto) {
    try {
      const user = await this.userService.findUserByEmail(authObject.email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordMatch = await this.userService.comparePassword(
        authObject.password,
        user.password,
      );

      if (!passwordMatch) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const authMethod = await this.userService.getAuthMethods(user);
      if (!authMethod.email) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      if (user.email_id && !user.is_email_verified) {
      
        throw new HttpException('Email is not verified', HttpStatus.UNAUTHORIZED);
      }

    
      const userSessionData = await this.authService.generateSessionDataForUser(user);
      return {
        status: 'success',
        data: userSessionData,
        message: 'Email login successfully.',
      };
    } catch (e) {
      return e;
    }
  }

  @Public()
  @Post('confirm-email')
  async confirmEmail(@Body() emailConfirmDto: EmailConfirmDto) {
    const { token } = emailConfirmDto;

    try {
      const updatedUser = await this.authService.handleConfirmEmail(token);
      const userSessionData =
        await this.authService.generateSessionDataForUser(updatedUser);

      return {
        status: 'success',
        data: userSessionData,
        message: 'Email confirm successfully.',
      };
    } catch (e) {
      new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post('guest-login')
  async guestLogin() {
    try {
      const guestUser = await this.userService.handleCreateGuestUser();
      const userSessionData =
        await this.authService.generateSessionDataForUser(guestUser);

      return {
        status: 'success',
        data: userSessionData,
        message: 'Guest login successfully.',
      };
    } catch (e) {
      return e;
    }
  }
  @Post('check-user-login')
  async checkUserLogin(@Req() req: UserWithRequest) {
    try {
      const userSessionData =
        await this.authService.generateSessionDataForUser(req.user);

      return {
        status: 'success',
        data: userSessionData,
        message: 'User login successfully.',
      };
    } catch (e) {
      return e;
    }

  }
}
