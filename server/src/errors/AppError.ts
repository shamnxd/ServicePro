import { StatusCode } from "../constants/statusCodes";

export class AppError extends Error {
  public readonly statusCode: StatusCode;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: StatusCode = StatusCode.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
