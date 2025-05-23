import { NextFunction, Request, Response } from 'express';

import env from '../util/env';
import DataOperation from './data-operation';
import RequestContext from './request-context';

/**
 * Contains additional information about a request
 */
export default interface HarmonyRequest extends Request {
  context: RequestContext;
  operation: DataOperation;
  user: string;
  accessToken: string;
  authorized: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  files?: any;
}

/**
 * Middleware to add request context information to the data operation.
 *
 * @param req - The client request, containing an operation
 * @param res - The client response
 * @param next - The next function in the middleware chain
 *
 */
export function addRequestContextToOperation(
  req: HarmonyRequest, res: Response, next: NextFunction,
): void {
  const { operation, context } = req;

  if (!operation) return next();

  operation.requestId = context.id;
  if (req.context.messages.length > 0) {
    operation.message = req.context.messages.join(' ');
  }
  operation.requestStartTime = context.startTime;
  operation.user = req.user || 'anonymous';
  operation.client = env.clientId;
  operation.accessToken = req.accessToken || '';
  return next();
}
