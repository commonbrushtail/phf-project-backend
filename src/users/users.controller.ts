import { Controller, Post, Req, Body, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserWithReqeust } from 'src/auth/interface/auth.interface';
import { changeUsernameDto } from './dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
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
    @Res() response: Response,
  ) {
    try {
      const updatedUser = await this.usersService.updateUsername(
        req.user,
        payload,
      );
      const userSession =
        await this.authService.generateSessionDataForUser(updatedUser);

      const responseObject = this.authService.setAccessTokenCookie(
        response,
        userSession.access_token,
      );

      return responseObject.send({
        status: 'success',
        data: userSession.userData,
        message: 'Username updated successfully.',
      });
    } catch (e) {
      return e;
    }
  }
}
