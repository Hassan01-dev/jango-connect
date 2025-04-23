// middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from 'express'
import { AppError, createErrorMiddleware } from '../utils/types/errors.types'

interface ErrorResponse {
  message: string
  error: string
  stack?: string
}

export const errorMiddleware = createErrorMiddleware(
  (err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err)

    let statusCode = 500
    let errorMessage = 'An unknown error occurred'

    if (err instanceof AppError) {
      statusCode = err.statusCode
      errorMessage = err.message
    } else if (err instanceof Error) {
      errorMessage = err.message
    }

    const errorResponse: ErrorResponse = {
      message: 'Server Error',
      error: errorMessage
    }

    if (process.env.NODE_ENV === 'development' && err instanceof Error) {
      errorResponse.stack = err.stack
    }

    res.status(statusCode).json(errorResponse)
  }
)

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({ message: 'Resource not found' })
}
