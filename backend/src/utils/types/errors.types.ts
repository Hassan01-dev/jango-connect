import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export interface AppErrorOptions {
  message: string;
  statusCode: number;
  isOperational?: boolean;
}

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.statusCode = options.statusCode;
    this.isOperational = options.isOperational ?? true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export type ErrorMiddleware = ErrorRequestHandler;

// Helper function to create a typed error middleware
export const createErrorMiddleware = (
  handler: (err: Error | AppError | unknown, req: Request, res: Response, next: NextFunction) => void
): ErrorMiddleware => {
  return handler as ErrorMiddleware;
};
