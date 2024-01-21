import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('AccessToken') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    const isRefreshToken = this.reflector.get<boolean>(
      'RefreshToken',
      context.getHandler(),
    )

    if (isPublic || isRefreshToken) {
      // If the route is marked as public, skip JWT authentication.
      return true;
    }

    

    // If the route is not public, proceed with the usual JWT authentication.
    return super.canActivate(context) as boolean;
  }
}
