import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { EMessagePattern, ISendOtpEmailOptions } from '@repo/types';
import { AppService } from './app.service';
import { ISendMailOptions } from '@nestjs-modules/mailer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: EMessagePattern.SEND_EMAIL_CONFIRMATION })
  async verifyEmail(email: string) {
    return await this.appService.sendEmailConfirmationEmail(email);
  }

  @MessagePattern({ cmd: EMessagePattern.SEND_OTP_EMAIL })
  async sendOtp({ to, context }: ISendOtpEmailOptions) {
    return await this.appService.send({
      to,
      subject: 'One-time-code',
      context,
    });
  }

  @MessagePattern({ cmd: EMessagePattern.SEND_EMAIL })
  async send(options: ISendMailOptions) {
    return await this.appService.send(options);
  }
}
