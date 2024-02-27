import { NextFunction, Request, Response } from 'express';
import { Exception } from '@/utils/exception';
import { ZodError } from 'zod';

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    const formatMessage = error.issues;

    return res.status(400).json(formatMessage);
  }

  if (error instanceof Exception) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(500).json(error.message);
}
