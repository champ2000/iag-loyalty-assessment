export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ServerError extends AppError {
  constructor(message: string) {
    super(500, message, "SERVER_ERROR");
    this.name = "ServerError";
  }
}
