import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EMessagePattern } from '@repo/types';
import { OtpResendAuthDto } from 'dtos/otp-resend.dto';
import { OtpService } from './otp.service';

@Controller()
export class OtpController {
  constructor(private otpService: OtpService) {}

  @MessagePattern({ cmd: EMessagePattern.OTP_RESEND })
  async otpResend({ query }: OtpResendAuthDto) {
    return await this.otpService.resend(query);
  }
}
