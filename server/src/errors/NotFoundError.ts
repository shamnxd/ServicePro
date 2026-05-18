import { AppError } from "./AppError";
import { StatusCode } from "../constants/statusCodes";

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, StatusCode.NOT_FOUND);
  }
}
