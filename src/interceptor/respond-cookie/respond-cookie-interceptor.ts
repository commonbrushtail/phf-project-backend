import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RespondCookieInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const noCookieInterceptor = this.reflector.get<boolean>(
      'noCookieInterceptor',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    if (noCookieInterceptor) {
      // console.log('no cookie run');
      return next.handle();
    }

    if (response) {
      // console.log('response run');
      return next.handle().pipe(
        map((data) => {
          const response = context.switchToHttp().getResponse();

          response.cookie('access_token', data.data.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            signed: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
          });
          delete data.data.access_token;

          return data;
        }),
      );
    }

    if (request) {
      // console.log('request run');
      return next.handle();
    }
  }
}
