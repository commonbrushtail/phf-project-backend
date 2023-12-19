import { Controller, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('change-username')
  async changeUsername(@Req() req: Request) {
    console.log(req.user);
  }
}
