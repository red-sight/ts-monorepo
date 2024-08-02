import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { config } from '@repo/config';
import {
  EMessagePattern,
  EOtpChannelName,
  IOTPStore,
  IOtpResend,
  IOtpVerifyOptions,
  ISendOtpAuthServiceOptions,
} from '@repo/types';
import { randomInt, randomUUID } from 'node:crypto';
import Redis from 'ioredis';
import { lastValueFrom, timeout } from 'rxjs';

// interface IOtpAvailableChannel {
//   channel: EOtpChannelName;
//   to: string;
//   resendBlockTtl: number;
// }

@Injectable()
export class OtpService {
  constructor(
    @Inject('MAILSERVICE') private mailServiceClient: ClientProxy,
    @InjectRedis() private readonly store: Redis,
  ) {}

  public async send({
    channel,
    template = 'otp',
    templateContext,
    subject = 'Confirm your action',
    to,
    ttl = config.otpSessionTTL,
    data,
    resendBlockTtl = config.otpResendBlockTTL,
  }: ISendOtpAuthServiceOptions) {
    const resendBlockKey = this.genResendBlockKey({ to, channel });
    const isSendBlocked = await this.store.ttl(resendBlockKey);
    if (isSendBlocked !== -2)
      throw new BadRequestException(`Resend is blocked for ${isSendBlocked}`);
    const code = this.genCode();
    const token = this.genToken();
    const otpKey = this.genOtpKey(token);

    await this.store.set(
      otpKey,
      JSON.stringify({
        subject,
        template,
        templateContext,
        ttl,
        resendBlockTtl,
        data,
        code,
      } as IOTPStore),
      'PX',
      ttl,
    );
    await this.store.set(resendBlockKey, 'true', 'PX', resendBlockTtl);

    const expiresAt = await this.getExpiryByKey(otpKey);
    const blockedUntil = await this.getExpiryByKey(resendBlockKey);

    if (channel === EOtpChannelName.EMAIL) {
      await this.sendEmail({
        to,
        template,
        subject,
        templateContext: {
          ...templateContext,
          code,
          token,
          expiresAt,
          blockedUntil,
        },
      });
    }

    return {
      token,
      expiresAt,
      blockedUntil,
    };
  }

  public async resend({ token, channel, to }: IOtpResend) {
    const stored = await this.getStoredByToken(token);
    return await this.send({
      ...stored,
      channel,
      to,
    });
  }

  public async verify({ token, code }: IOtpVerifyOptions) {
    const stored = await this.getStoredByToken(token);
    if (stored?.code !== code)
      throw new UnauthorizedException('Wrong OTP code');
    await this.store.del(this.genOtpKey(token));
    return stored.data;
  }

  private async getStoredByToken(token: string) {
    const otpKey = this.genOtpKey(token);
    const stored = await this.store.get(otpKey);
    if (!stored)
      throw new NotFoundException('Otp record not found. Request a new one');

    const parsed: IOTPStore = JSON.parse(stored);
    return parsed;
  }

  private async getExpiryByKey(key: string) {
    const expireTime = await this.store.pexpiretime(key);
    console.log(expireTime);
    if ([-1, -2].includes(expireTime)) return null;
    return new Date(expireTime);
  }

  private async sendEmail({
    to,
    subject,
    template,
    templateContext = {},
  }: Pick<
    ISendOtpAuthServiceOptions,
    'to' | 'template' | 'templateContext' | 'subject'
  >) {
    return await lastValueFrom(
      this.mailServiceClient
        .send(
          { cmd: EMessagePattern.SEND_EMAIL },
          {
            to,
            subject,
            template,

            context: templateContext,
          },
        )
        .pipe(timeout(config.serviceMethodTimeout)),
    );
  }

  private genToken() {
    return randomUUID();
  }

  private genOtpKey(token: string) {
    return `otp:${token}`;
  }

  private genResendBlockKey({
    to,
    channel,
  }: Pick<ISendOtpAuthServiceOptions, 'to' | 'channel'>) {
    return `otp-resend-block:${channel}:${to}`;
  }

  private genCode(length: number = config.otpLength) {
    // return randomInt(0, length).toString().padStart(length, '0');
    const maxNumber = 10 ** length - 1;
    const randomNumber = randomInt(0, maxNumber + 1);
    const randomNumberString = randomNumber.toString().padStart(length, '0');
    return randomNumberString;
  }
}
