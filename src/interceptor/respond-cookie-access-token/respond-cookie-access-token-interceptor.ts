import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { mergeMap,firstValueFrom,Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RespondCookieAccessTokenInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
   
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();


    if (response) {
      console.log(response,'response')
      return next.handle().pipe(
        mergeMap(async (data) => {
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
