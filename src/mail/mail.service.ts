import { Injectable, Inject } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(
    @Inject('NodemailerTransporter')
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

  async sendConfirmationEmail(to: string, token: string) {
    const subject = 'Confirm your email';
    const text = 'Confirm your email';
    const html = `<a href="http://localhost:3000/auth/confirm-email/${token}">Confirm your email</a>`;
    await this.sendMail(to, subject, text, html);
  }
}
