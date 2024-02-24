import { NextFunction, Request, Response } from 'express';
import { Exception } from './exception';

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof Exception) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(500).json(error.message);
}
