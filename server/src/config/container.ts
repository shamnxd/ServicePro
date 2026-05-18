import "reflect-metadata";
import { container } from "tsyringe";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { UserRepository } from "../repositories/mongo/UserRepository";
import { IUseCase } from "../interfaces/usecases/IUseCase";
import { LoginRequestDto, LoginResponseDto } from "../dtos/auth.dto";
import { LoginUseCase } from "../usecases/auth/LoginUseCase";
import { RefreshTokenUseCase } from "../usecases/auth/RefreshTokenUseCase";

// Register repositories
container.registerSingleton<IUserRepository>("UserRepository", UserRepository);

// Register use case abstractions
container.registerSingleton<IUseCase<LoginRequestDto, LoginResponseDto>>("LoginUseCase", LoginUseCase);
container.registerSingleton<IUseCase<string, string>>("RefreshTokenUseCase", RefreshTokenUseCase);
