import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { StatusCode } from "../constants/statusCodes";
import { Logger } from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // If it's a planned operational application error (e.g., Validation, Auth, Not Found)
  if (err instanceof AppError) {
    // Optionally log warnings for auditable events (like failed unauthorized requests)
    if (err.statusCode === StatusCode.UNAUTHORIZED || err.statusCode === StatusCode.FORBIDDEN) {
      Logger.warn(`Security Warning: ${err.message} on path ${req.path}`);
    }
    
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
    return;
  }

  // Log critical non-operational programmer errors for debugging
  Logger.error(`Unhandled exception occurred on ${req.method} ${req.path}`, err);

  // Return generic internal server error for security in production
  res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal server error"
  });
};
