import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map,firstValueFrom } from 'rxjs';
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
      return next.handle();
    }

    if (response) {
      return next.handle().pipe(
        map(async (data) => {
          if (data.data && data.data instanceof Promise) {
            data.data = await data.data;
          }

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
      return next.handle();
    }
  }
}
