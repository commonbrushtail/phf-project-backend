import { Controller, Post, Req, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserWithReqeust } from 'src/auth/interface/auth.interface';
import { changeUsernameDto } from './dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { newUsernameResponse } from './interface/users.interface';
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('change-username')
  async changeUsername(
    @Body() payload: changeUsernameDto,
    @Req() req: UserWithReqeust,
  ): Promise<newUsernameResponse> {
    try {
      const updatedUser = await this.usersService.updateUsername(
        req.user,
        payload,
      );
      const updatedUserSession =
        await this.authService.generateSessionDataForUser(updatedUser);

      return {
        status: 'success',
        data: updatedUserSession,
        message: 'Username updated successfully.',
      };
    } catch (e) {
      return e;
    }
  }

  
}
