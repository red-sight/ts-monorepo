import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { config } from '@repo/config';
import { IServiceMethodData } from '@repo/types';
import {
  catchError,
  defaultIfEmpty,
  firstValueFrom,
  throwError,
  timeout,
} from 'rxjs';

@Injectable()
export class GateService {
  constructor(@Inject('MICROSERVICE') private client: ClientProxy) {}

  public async serviceMethodRequest(cmd: string, data: IServiceMethodData) {
    return await firstValueFrom(
      this.client.send({ cmd }, data).pipe(
        timeout(config.serviceMethodTimeout),
        defaultIfEmpty(''),
        catchError((err) => {
          if (!(err instanceof RpcException)) {
            err = new RpcException({
              statusCode: err.error?.statusCode || 500,
              message: err.message || 'Internal server error',
            });
          }
          return throwError(() => err);
        }),
      ),
    );
  }
}
