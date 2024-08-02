import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { config } from '@repo/config';
import { SignupLocalDto } from '@repo/dtos';
import { EOtpChannelName, ERole, ETemplateCode } from '@repo/types';
import { OtpService } from 'modules/otp/otp.service';
import { PrismaService } from 'prisma.service';
import { Password } from 'utils/Password';

@Injectable()
export class SignupService {
  constructor(
    private prisma: PrismaService,
    private otpService: OtpService,
  ) {}

  async signupLocal({ email, password }: SignupLocalDto) {
    const authMethodExists = await this.prisma.localAuth.findUnique({
      where: { email },
      include: { authMethod: true },
    });
    if (authMethodExists)
      throw new RpcException({
        statusCode: 400,
        message: 'This email is already in use',
      });

    const passwordInstance = new Password({ password });
    return await this.prisma.$transaction(async (tx) => {
      await tx.profile.create({
        data: {
          roleName: ERole.CUSTOMER,
          authMethods: {
            create: [
              {
                localAuth: {
                  create: {
                    email,
                    password: passwordInstance.hash,
                    salt: passwordInstance.salt,
                  },
                },
              },
            ],
          },
        },
        include: {
          authMethods: {
            include: {
              localAuth: true,
            },
          },
        },
      });
      const link = new URL('/auth/confirm/email', config.gatewayHost);
      link.port = config.gatewayPort.toString();
      const otpData = await this.otpService.send({
        to: email,
        channel: EOtpChannelName.EMAIL,
        data: { email },
        template: ETemplateCode.VERIFY_EMAIL,
        ttl: 1000 * 60 * 60 * 24 * 7,
        templateContext: {
          link,
        },
      });
      return {
        message:
          'Email confirmation is required. Please follow the link in your inbox.',
        ...otpData,
      };
    });
  }

  async verifyEmail(opts: { token: string; code: string }) {
    const { email } = await this.otpService.verify(opts);
    const localAuth = await this.prisma.localAuth.findUnique({
      where: { email },
    });
    if (!localAuth) throw new BadRequestException('Email not found');
    await this.prisma.authMethod.update({
      where: { id: localAuth.authMethodId },
      data: { isConfirmed: true },
    });
    return {
      message: 'Email is confirmed successfully',
    };
  }
}
