import { TransportType } from "@nestjs-modules/mailer/dist/interfaces/mailer-options.interface";
import {
  ClientProviderOptions,
  MicroserviceOptions
} from "@nestjs/microservices";
import { SessionOptions } from "express-session";
import { RedisOptions } from "ioredis";
import { _StrategyOptionsBase } from "passport-google-oauth20";

export interface IConfig {
  appName: string;
  gatewayHost: string;
  gatewayPort: number;
  appPrefixCode: string;
  expressPort: number;
  nestMicroserviceOptions: MicroserviceOptions;
  nestMicroserviceClientOptions: ClientProviderOptions;
  googleOAuthCreds: _StrategyOptionsBase;
  adminEmail: string;
  permissions: {
    [key: string]: string;
  };
  emailUser: string;
  emailTransporter: TransportType;
  redisOptions: RedisOptions;
  sessionSecret: string;
  sessionOptions: SessionOptions;
  sessionRefreshTokenTTL: number;
  otpSessionTTL: number;
  otpResendBlockTTL: number;
  serviceMethodTimeout: number;
  otpLength: number;
}
