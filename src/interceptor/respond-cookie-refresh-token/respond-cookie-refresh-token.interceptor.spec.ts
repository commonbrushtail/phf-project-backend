import { Reflector } from '@nestjs/core';
import { RespondCookieRefreshTokenInterceptor } from './respond-cookie-refresh-token.interceptor';

describe('RespondCookieRefreshTokenInterceptor', () => {
  it('should be defined', () => {
    expect(new RespondCookieRefreshTokenInterceptor(new Reflector)).toBeDefined();
  });
});
