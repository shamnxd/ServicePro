import { AppError } from "./AppError";
import { StatusCode } from "../constants/statusCodes";

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request") {
    super(message, StatusCode.BAD_REQUEST);
  }
}
