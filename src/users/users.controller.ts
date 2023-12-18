import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('change-username')
  async changeUsername(@Body() newUsername) {}
}
