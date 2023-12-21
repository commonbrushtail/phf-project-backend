import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { NodemailerProvider } from './nodemailer.provider';
@Module({
  providers: [MailService, NodemailerProvider],
})
export class MailModule {}
