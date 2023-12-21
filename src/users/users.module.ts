import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/mail/mail.service';
import { NodemailerProvider } from 'src/mail/nodemailer.provider';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, AuthService, MailService, NodemailerProvider],
  controllers: [UsersController],
})
export class UsersModule {}
