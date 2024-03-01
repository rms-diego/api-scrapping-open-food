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
    const issues = error.errors.map((element) => ({
      message: element.message,
      path: element.path,
    }));

    return res.status(400).json({ issues });
  }

  if (error instanceof Exception) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(500).json(error.message);
}
