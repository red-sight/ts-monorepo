import { IServiceRequest } from '@repo/types';
import { Request } from 'express';

export function serializeRequest(req: Request): IServiceRequest {
  return {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    params: req.params,
    body: req.body,
  };
}
