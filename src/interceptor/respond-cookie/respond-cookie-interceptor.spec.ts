import { RespondCookieInterceptor } from './respond-cookie-interceptor';
import { Reflector } from '@nestjs/core';
describe('RespondCookieInterceptor', () => {
  it('should be defined', () => {
    expect(new RespondCookieInterceptor(new Reflector())).toBeDefined();
  });
});
