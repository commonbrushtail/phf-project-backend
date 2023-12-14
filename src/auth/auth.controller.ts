import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('google')
  async recieveToken(@Body() authObject: AuthDto) {
    try {
      const payload = await this.authService.verifyGoogleAuthToken(
        authObject.credential,
      );

      if (!payload) {
        return { status: 401, message: 'Unauthorized' };
      }
      const user = await this.authService.findOrCreateUser(payload);
      console.log(user);
    } catch (e) {
      console.log(e);
    }
  }
}
