import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { StatusCode } from "../constants/statusCodes";

export const validateDto = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors: result.error.errors.map(err => ({
          field: err.path.join("."),
          message: err.message
        }))
      });
      return;
    }
    // Reassign request body to parsed, fully validated, and typed data
    req.body = result.data;
    next();
  };
};
