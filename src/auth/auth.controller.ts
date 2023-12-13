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
      console.log(payload);
    } catch (e) {
      console.log(e);
    }
  }
}
