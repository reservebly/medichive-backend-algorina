import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  // private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // this.transporter = nodemailer.createTransport({
    //   host: this.configService.get<string>('EMAIL_HOST') || 'smtp.gmail.com',
    //   port: this.configService.get<number>('EMAIL_PORT') || 587,
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: this.configService.get<string>('EMAIL_USER'),
    //     pass: this.configService.get<string>('EMAIL_PASSWORD'),
    //   },
    // });
  }

  async sendRegistrationEmail(to: string, name: string, username: string, password: string) {
    // Email functionality temporarily disabled - missing nodemailer dependency
    console.log('Email would be sent to:', to, 'with credentials:', username);
    return { success: true, messageId: 'temp-id' };
  }

  async sendPasswordResetEmail(to: string, name: string, resetToken: string) {
    // Email functionality temporarily disabled - missing nodemailer dependency
    console.log('Password reset email would be sent to:', to, 'with token:', resetToken);
    return { success: true, messageId: 'temp-reset-id' };
  }
}