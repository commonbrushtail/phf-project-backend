import { Injectable, Inject } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(
    @Inject('NodemailerTransporter1')
    private nodemailerTransporter: nodemailer.Transporter,
  ) {}
  async sendMail(to: string, subject: string, text: string, html: string) {
    const mailOptions = {
      from: 'your.email@gmail.com',
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    await this.nodemailerTransporter.sendMail(mailOptions);
  }
}
