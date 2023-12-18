import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategies';
@Injectable()
export class JwtAuthGuard extends AuthGuard(JwtStrategy) {}
