import "reflect-metadata";
import { container } from "tsyringe";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { UserRepository } from "../repositories/mongo/UserRepository";
import { IClientRepository, GetClientsQuery, PaginatedClients } from "../interfaces/repositories/IClientRepository";
import { ClientRepository } from "../repositories/mongo/ClientRepository";

import { IUseCase } from "../interfaces/usecases/IUseCase";
import { LoginRequestDto, LoginResponseDto } from "../dtos/auth.dto";
import { LoginUseCase } from "../usecases/auth/LoginUseCase";
import { RefreshTokenUseCase } from "../usecases/auth/RefreshTokenUseCase";

import { CreateClientDto, UpdateClientDto } from "../dtos/client.dto";
import { IClient } from "../interfaces/models/IClient";
import { CreateClientUseCase } from "../usecases/clients/CreateClientUseCase";
import { GetClientsUseCase } from "../usecases/clients/GetClientsUseCase";
import { GetClientByIdUseCase } from "../usecases/clients/GetClientByIdUseCase";
import { UpdateClientUseCase } from "../usecases/clients/UpdateClientUseCase";
import { DeleteClientUseCase } from "../usecases/clients/DeleteClientUseCase";

// Register repositories
container.registerSingleton<IUserRepository>("UserRepository", UserRepository);
container.registerSingleton<IClientRepository>("ClientRepository", ClientRepository);

// Register use case abstractions
container.registerSingleton<IUseCase<LoginRequestDto, LoginResponseDto>>("LoginUseCase", LoginUseCase);
container.registerSingleton<IUseCase<string, string>>("RefreshTokenUseCase", RefreshTokenUseCase);

container.registerSingleton<IUseCase<CreateClientDto, IClient>>("CreateClientUseCase", CreateClientUseCase);
container.registerSingleton<IUseCase<GetClientsQuery, PaginatedClients>>("GetClientsUseCase", GetClientsUseCase);
container.registerSingleton<IUseCase<string, IClient | null>>("GetClientByIdUseCase", GetClientByIdUseCase);
container.registerSingleton<IUseCase<{ id: string; data: UpdateClientDto }, IClient>>("UpdateClientUseCase", UpdateClientUseCase);
container.registerSingleton<IUseCase<string, boolean>>("DeleteClientUseCase", DeleteClientUseCase);
