import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { VerifyCallback } from 'passport-google-oauth20';
import { EMessagePattern, ERole, IUserSessionData } from '@repo/types';
import { GateService } from 'services/gate.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private gateService: GateService) {
    super({
      usernameField: 'email', // If 'usernameField' is not specified, it defaults to 'username'
      passwordField: 'password',
    });
  }

  async validate(
    email: string,
    password: string,
    done: VerifyCallback,
  ): Promise<any> {
    const user: {
      id: string;
      role: { name: ERole };
    } = await this.gateService.serviceMethodRequest(
      EMessagePattern.SIGNIN_LOCAL,
      { body: { email, password } },
    );

    console.log('USER', user);

    const userSessionData: IUserSessionData = {
      id: user.id,
      role: user.role.name,
    };
    done(null, userSessionData);
  }
}
