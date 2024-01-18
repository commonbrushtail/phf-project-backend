import { RespondCookieAccessTokenInterceptor } from './respond-cookie-access-token-interceptor';
import { Reflector } from '@nestjs/core';
describe('RespondCookieInterceptor', () => {
  it('should be defined', () => {
    expect(new RespondCookieAccessTokenInterceptor(new Reflector())).toBeDefined();
  });
});
