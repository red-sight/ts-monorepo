import { LocalStrategy } from './strategies/local.strategy';
import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { config } from '@repo/config';
import { SessionSerializer } from './utils/session.serializer';
import { PassportModule } from '@nestjs/passport';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { RpcExceptionFilter } from 'filters/RcpExceptionFilter';
import { RedisModule } from '@nestjs-modules/ioredis';
import { GateService } from 'services/gate.service';
import { ServiceMethodInterceptor } from 'interceptors/service-method.interceptor';
import { AuthController } from 'controllers/auth.controller';
import { OtpInterceptor } from 'interceptors/otp.interceptor';
import { OtpService } from './services/otp.service';

@Global()
@Module({
  imports: [
    PassportModule.register({ session: true }),
    RedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        options: config.redisOptions,
      }),
    }),
    ClientsModule.register([
      {
        ...config.nestMicroserviceClientOptions,
        name: 'MICROSERVICE',
      },
    ]),
  ],
  providers: [
    SessionSerializer,
    {
      provide: APP_FILTER,
      useClass: RpcExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ServiceMethodInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: OtpInterceptor,
    },
    LocalStrategy,
    GateService,
    OtpService,
  ],
  controllers: [AuthController],
  exports: [RedisModule, ClientsModule, LocalStrategy],
})
export class AppModule {}
