import { SetMetadata } from '@nestjs/common';
export const RefreshToken = () =>
  SetMetadata('RefreshToken', true);
