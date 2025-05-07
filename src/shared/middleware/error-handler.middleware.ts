import { Request, Response, NextFunction } from 'express';
import { HttpError, InternalServerError } from '../errors/http-error';

interface ErrorResponse {
  success: false;
  error: {
    code: number;
    message: string;
    details?: any;
  };
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
  });

  let httpError: HttpError;

  if (error instanceof HttpError) {
    httpError = error;
  } else {
    // Si no es un HttpError, lo convertimos en un error interno
    httpError = new InternalServerError('Ha ocurrido un error inesperado', {
      originalError: error.message,
    });
  }

  const response: ErrorResponse = {
    success: false,
    error: {
      code: httpError.statusCode,
      message: httpError.message,
      ...(httpError.details && { details: httpError.details }),
    },
  };

  res.status(httpError.statusCode).json(response);
};
