import * as nodemailer from 'nodemailer';
export const NodemailerProvider = {
  provide: 'NodemailerTransporter1',
  useFactory: () => {
    return nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'fd5915c57c45c7',
        pass: '787658cb80df74',
      },
    });
  },
};
