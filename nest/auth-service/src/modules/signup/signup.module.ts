import { Module } from '@nestjs/common';
import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';
import { ClientsModule } from '@nestjs/microservices';
import { config } from '@repo/config';
import { PrismaService } from 'prisma.service';
import { OtpService } from 'modules/otp/otp.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        ...config.nestMicroserviceClientOptions,
        name: 'MAILSERVICE',
      },
    ]),
  ],
  controllers: [SignupController],
  providers: [SignupService, PrismaService, OtpService],
})
export class SignupModule {}
