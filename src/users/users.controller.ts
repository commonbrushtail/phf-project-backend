import { Controller, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDataRequest } from 'src/auth/interface/auth.interface';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('change-username')
  async changeUsername(@Req() req: UserDataRequest) {
    console.log(req.userData);
  }
}
