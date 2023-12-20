import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private transporter: nodemailer.Transporter) {
    this.transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'fd5915c57c45c7',
        pass: '787658cb80df74',
      },
    });
  }
  async sendMail(to: string, subject: string, text: string, html: string) {
    const mailOptions = {
      from: 'your.email@gmail.com',
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
