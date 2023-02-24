import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/users/enums/role.enum';
import { SendContactEmailDto } from './dto/send-contact-email.dto';
import { SendForgotPasswordEmailDto } from './dto/send-forgot-password.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendForgotPasswordEmail({
    email,
    token,
    role,
  }: SendForgotPasswordEmailDto): Promise<void> {
    const frontendUrl =
      role === Role.ADMIN
        ? this.configService.get('ADMINS_FRONT_RESET_PASSWORD_URL')
        : role === Role.SELLER
        ? this.configService.get('SELLERS_FRONT_RESET_PASSWORD_URL')
        : this.configService.get('CLIENTS_FRONT_RESET_PASSWORD_URL');

    await this.mailService.sendMail({
      to: email,
      subject: 'Password reset',
      template: './forgot-password',
      context: {
        frontendUrl,
        email,
        token,
      },
    });
  }

  async sendContactEmail({
    email,
    content,
  }: SendContactEmailDto): Promise<void> {
    await this.mailService.sendMail({
      to: this.configService.get('CONTACT_EMAIL_ADDRESS'),
      subject: 'Contact',
      template: './email-contact',
      from: email,
      context: {
        content,
      },
    });
  }
}
