import { SetMetadata } from '@nestjs/common';

export const IsPublic = (...args: string[]) => SetMetadata('is-public', args);
