import { IncomingHttpHeaders } from "http";
import { ParsedQs } from "qs";

export enum EOtpChannelName {
  EMAIL = "email",
  SMS = "sms",
  TOTP = "totp",
  WEBAUTHN = "webauthn"
}

export interface IAvailableOtpChannel {
  channelName: EOtpChannelName;
  to: string;
  blockedUntil?: null | Date;
}

export interface IOtpOptions {
  request: {
    headers?: IncomingHttpHeaders;
    query?: ParsedQs;
    body: any;
  };
  channelName: EOtpChannelName;
  template?: string;
  templateData?: any;
  token?: string;
  otpSessionTTL?: number;
  availableChannels: IAvailableOtpChannel[];
}

export interface ISendOtpAuthServiceOptions {
  channel: EOtpChannelName;
  subject?: string;
  template?: string;
  templateContext?: any;
  to: string;
  ttl?: number;
  resendBlockTtl?: number;
  data: any;
}

export interface IOtpVerifyOptions {
  token: string;
  code: string;
}

export interface IOTPStore
  extends Pick<
    ISendOtpAuthServiceOptions,
    | "subject"
    | "template"
    | "templateContext"
    | "ttl"
    | "resendBlockTtl"
    | "data"
  > {
  code?: string;
}

export interface IOtpResend
  extends Pick<ISendOtpAuthServiceOptions, "channel" | "to"> {
  token: string;
}
