import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SERVICE_METHOD_KEY } from 'decorators/service-method.decorator';
import { Request } from 'express';
import { GateService } from 'services/gate.service';
import { Observable, from, map, switchMap } from 'rxjs';
import { serializeRequest } from 'utils/serialize-request';

@Injectable()
export class ServiceMethodInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private gateService: GateService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options = this.getOptions(context);
    if (!options) return next.handle();

    const request: Request = context.switchToHttp().getRequest();

    return from(
      this.gateService.serviceMethodRequest(options.cmd, {
        ...serializeRequest(request),
        user: request.user,
      }),
    ).pipe(switchMap((res) => next.handle().pipe(map(() => res))));
  }

  private getOptions(context: ExecutionContext) {
    const handler = context.getHandler();
    const classHandler = context.getClass();

    const serviceMethodOptions =
      this.reflector.get(SERVICE_METHOD_KEY, handler) ||
      this.reflector.get(SERVICE_METHOD_KEY, classHandler);

    return serviceMethodOptions;
  }
}
