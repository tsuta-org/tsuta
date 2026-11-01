export class TsutaError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'TsutaError'
  }
}

export class UnauthorizedError extends TsutaError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401)
    this.name = 'UnauthorizedError'
  }
}

export class NotFoundError extends TsutaError {
  constructor(message = 'Not Found') {
    super(message, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class BadRequestError extends TsutaError {
  constructor(message = 'Bad Request') {
    super(message, 'BAD_REQUEST', 400)
    this.name = 'BadRequestError'
  }
}

export class ForbiddenError extends TsutaError {
  constructor(message = 'Forbidden') {
    super(message, 'FORBIDDEN', 403)
    this.name = 'ForbiddenError'
  }
}
