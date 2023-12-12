import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  @Post('google')
  async recieveToken(@Body() authObject: AuthDto) {
    console.log(authObject);
  }
}
