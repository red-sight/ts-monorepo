import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { SignupService } from './signup.service';
import { EMessagePattern } from '@repo/types';
import { SignupLocalAuthDto } from 'dtos/signup-local.dto';
import { EmailConfirmationAuthDto } from 'dtos/email-confirmation.dto';

@Controller()
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @MessagePattern({ cmd: EMessagePattern.SIGNUP_LOCAL })
  async signupLocal({ body }: SignupLocalAuthDto) {
    return await this.signupService.signupLocal(body);
  }

  @MessagePattern({ cmd: EMessagePattern.EMAIL_CONFIRMATION })
  async emailConfirmation({ query }: EmailConfirmationAuthDto) {
    return await this.signupService.verifyEmail(query);
  }
}
