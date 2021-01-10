import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer';

const initialize = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || '',
    port: Number(process.env.EMAIL_PORT) || 0,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  } as SMTPTransport.TransportOptions);
}

export const sendEmailToken = async (email: string, token: string) => {
  const transporter = initialize();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Prisma Tutorial login token',
    html: `The login token for the API is: ${token}`
  })
}
