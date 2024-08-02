import { Injectable } from '@nestjs/common';

// interface IOtpSendOptions {
//   channel: EOtpChannelName;
//   to: string;
//   template: string;
//   templateContext: object;
// }

/*

@Otp({
  ttl: 1000 * 60 * 5,              // 1000 * 60 * 5 
  template: 'email-confirm',       // 'otp'
  channel: EOtpChannelName.EMAIL,  // user.defaultOtpChannel
})

*/

@Injectable()
export class OtpService {
  constructor() {}

  public async send() {}
}
