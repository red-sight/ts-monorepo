import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ServiceMethod } from 'decorators/service-method.decorator';
import { EMessagePattern } from '@repo/types';
import { PassportLocalGuard } from 'guards/passport-local.guard';
import { Request } from 'express';

@Controller('/auth')
export class AuthController {
  constructor() {}

  @Post('/signup/local')
  @ServiceMethod(EMessagePattern.SIGNUP_LOCAL)
  async signupLocal() {}

  @Post('/signin/local')
  @UseGuards(PassportLocalGuard)
  async signinLocal(@Req() req: Request) {
    return req.user;
  }

  @Get('/confirm/email')
  @ServiceMethod(EMessagePattern.EMAIL_CONFIRMATION)
  async emailConfirmation() {}

  @Get('/otp/resend')
  @ServiceMethod(EMessagePattern.OTP_RESEND)
  async otpResend() {}
}
