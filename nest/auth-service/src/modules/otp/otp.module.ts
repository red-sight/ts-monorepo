import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { ClientsModule } from '@nestjs/microservices';
import { config } from '@repo/config';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    ClientsModule.register([
      {
        ...config.nestMicroserviceClientOptions,
        name: 'MAILSERVICE',
      },
    ]),
    RedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        options: config.redisOptions,
      }),
    }),
  ],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
