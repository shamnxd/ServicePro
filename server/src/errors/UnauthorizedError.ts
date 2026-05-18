import { AppError } from "./AppError";
import { StatusCode } from "../constants/statusCodes";

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super(message, StatusCode.UNAUTHORIZED);
  }
}
