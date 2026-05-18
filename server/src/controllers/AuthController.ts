import { Request, Response, NextFunction } from "express";
import { inject, autoInjectable } from "tsyringe";
import { IUseCase } from "../interfaces/usecases/IUseCase";
import { LoginRequestDto, LoginResponseDto } from "../dtos/auth.dto";
import { StatusCode } from "../constants/statusCodes";
import { AppError } from "../errors/AppError";
import { env } from "../config/env";

@autoInjectable()
export class AuthController {
  constructor(
    @inject("LoginUseCase")
    private _loginUseCase?: IUseCase<LoginRequestDto, LoginResponseDto>,
    @inject("RefreshTokenUseCase")
    private _refreshTokenUseCase?: IUseCase<string, string>
  ) {}

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto = req.body as LoginRequestDto;
      const result = await this._loginUseCase!.execute(dto);

      // Set Refresh Token as secure, HTTP-only Cookie using custom configured name
      res.cookie(env.COOKIE_NAME_REFRESH, result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days in ms
      });

      res.status(StatusCode.OK).json({
        success: true,
        accessToken: result.accessToken,
        user: result.user
      });
    } catch (error) {
      next(error);
    }
  };

  public refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const refreshToken = req.cookies?.[env.COOKIE_NAME_REFRESH] as string | undefined;
      if (!refreshToken) {
        throw new AppError("No refresh token session found", StatusCode.UNAUTHORIZED);
      }

      const newAccessToken = await this._refreshTokenUseCase!.execute(refreshToken);

      res.status(StatusCode.OK).json({
        success: true,
        accessToken: newAccessToken
      });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Clear HTTP cookie using custom configured name
      res.clearCookie(env.COOKIE_NAME_REFRESH, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict"
      });

      res.status(StatusCode.OK).json({
        success: true,
        message: "Successfully logged out"
      });
    } catch (error) {
      next(error);
    }
  };
}
