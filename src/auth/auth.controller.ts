import { Body, Controller, Post } from '@nestjs/common';

interface authDto {
  credential: string;
  clientId: string;
}

@Controller('auth')
export class AuthController {
  @Post('google')
  async recieveToken(@Body() authObject: authDto) {
    console.log(authObject);
  }
}
