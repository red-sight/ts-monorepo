import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Otp } from 'decorators/otp.decorator';
import Redis from 'ioredis';
import { Request } from 'express';

@Injectable()
export class OtpInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    @InjectRedis() private readonly store: Redis,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const otp = this.reflector.get(Otp, context.getHandler());

    if (!otp) return next.handle();

    const req: Request = context.switchToHttp().getRequest();

    if (!req.user)
      throw new Error(
        'OTP decorator may be assigned to authorized routes only',
      );

    return next.handle();
  }
}
