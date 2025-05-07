export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = 'Bad Request', details?: any) {
    super(400, message, details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Unauthorized', details?: any) {
    super(401, message, details);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = 'Forbidden', details?: any) {
    super(403, message, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Not Found', details?: any) {
    super(404, message, details);
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = 'Internal Server Error', details?: any) {
    super(500, message, details);
  }
}
