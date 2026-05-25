import "reflect-metadata";
import { container } from "tsyringe";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { UserRepository } from "../repositories/mongo/UserRepository";
import { IClientRepository, GetClientsQuery, PaginatedClients } from "../interfaces/repositories/IClientRepository";
import { ClientRepository } from "../repositories/mongo/ClientRepository";

// Complaints & SMR Repositories
import { IComplaintRepository, GetComplaintsQuery, PaginatedComplaints } from "../interfaces/repositories/IComplaintRepository";
import { ComplaintRepository } from "../repositories/mongo/ComplaintRepository";
import { ISMRRepository } from "../interfaces/repositories/ISMRRepository";
import { SMRRepository } from "../repositories/mongo/SMRRepository";
import { IStaffRepository } from "../interfaces/repositories/IStaffRepository";
import { StaffRepository } from "../repositories/mongo/StaffRepository";

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

// Complaints Use Cases
import { IComplaint } from "../interfaces/models/IComplaint";
import { CreateComplaintDto, UpdateComplaintDto } from "../dtos/complaint.dto";
import { CreateComplaintUseCase } from "../usecases/complaints/CreateComplaintUseCase";
import { GetComplaintsUseCase } from "../usecases/complaints/GetComplaintsUseCase";
import { GetComplaintByIdUseCase } from "../usecases/complaints/GetComplaintByIdUseCase";
import { UpdateComplaintUseCase } from "../usecases/complaints/UpdateComplaintUseCase";
import { DeleteComplaintUseCase } from "../usecases/complaints/DeleteComplaintUseCase";

// SMR Use Cases
import { ISMR } from "../interfaces/models/ISMR";
import { CreateSMRDto, UpdateSMRDto } from "../dtos/smr.dto";
import { CreateSMRUseCase } from "../usecases/smrs/CreateSMRUseCase";
import { GetSMRByIdUseCase } from "../usecases/smrs/GetSMRByIdUseCase";
import { GetSMRsByComplaintUseCase } from "../usecases/smrs/GetSMRsByComplaintUseCase";
import { UpdateSMRUseCase } from "../usecases/smrs/UpdateSMRUseCase";
import { ApproveSMRUseCase, SMRApprovalInput } from "../usecases/smrs/ApproveSMRUseCase";

import { IStaff } from "../interfaces/models/IStaff";
import { StaffWorkHistoryItem } from "../interfaces/models/IStaff";
import { CreateStaffDto, UpdateStaffDto } from "../dtos/staff.dto";
import { GetStaffQuery, PaginatedStaff } from "../interfaces/repositories/IStaffRepository";
import { CreateStaffUseCase } from "../usecases/staff/CreateStaffUseCase";
import { GetStaffUseCase } from "../usecases/staff/GetStaffUseCase";
import { GetStaffByIdUseCase } from "../usecases/staff/GetStaffByIdUseCase";
import { UpdateStaffUseCase } from "../usecases/staff/UpdateStaffUseCase";
import { DeleteStaffUseCase } from "../usecases/staff/DeleteStaffUseCase";
import { GetStaffWorkHistoryUseCase } from "../usecases/staff/GetStaffWorkHistoryUseCase";

// Register repositories
container.registerSingleton<IUserRepository>("UserRepository", UserRepository);
container.registerSingleton<IClientRepository>("ClientRepository", ClientRepository);
container.registerSingleton<IComplaintRepository>("ComplaintRepository", ComplaintRepository);
container.registerSingleton<ISMRRepository>("SMRRepository", SMRRepository);
container.registerSingleton<IStaffRepository>("StaffRepository", StaffRepository);

// Register use case abstractions
container.registerSingleton<IUseCase<LoginRequestDto, LoginResponseDto>>("LoginUseCase", LoginUseCase);
container.registerSingleton<IUseCase<string, string>>("RefreshTokenUseCase", RefreshTokenUseCase);

container.registerSingleton<IUseCase<CreateClientDto, IClient>>("CreateClientUseCase", CreateClientUseCase);
container.registerSingleton<IUseCase<GetClientsQuery, PaginatedClients>>("GetClientsUseCase", GetClientsUseCase);
container.registerSingleton<IUseCase<string, IClient | null>>("GetClientByIdUseCase", GetClientByIdUseCase);
container.registerSingleton<IUseCase<{ id: string; data: UpdateClientDto }, IClient>>("UpdateClientUseCase", UpdateClientUseCase);
container.registerSingleton<IUseCase<string, boolean>>("DeleteClientUseCase", DeleteClientUseCase);

// Complaints Use Cases
container.registerSingleton<IUseCase<CreateComplaintDto, IComplaint>>("CreateComplaintUseCase", CreateComplaintUseCase);
container.registerSingleton<IUseCase<GetComplaintsQuery, PaginatedComplaints>>("GetComplaintsUseCase", GetComplaintsUseCase);
container.registerSingleton<IUseCase<string, IComplaint | null>>("GetComplaintByIdUseCase", GetComplaintByIdUseCase);
container.registerSingleton<IUseCase<{ id: string; data: UpdateComplaintDto }, IComplaint | null>>("UpdateComplaintUseCase", UpdateComplaintUseCase);
container.registerSingleton<IUseCase<string, boolean>>("DeleteComplaintUseCase", DeleteComplaintUseCase);

// SMR Use Cases
container.registerSingleton<IUseCase<CreateSMRDto, ISMR>>("CreateSMRUseCase", CreateSMRUseCase);
container.registerSingleton<IUseCase<string, ISMR | null>>("GetSMRByIdUseCase", GetSMRByIdUseCase);
container.registerSingleton<IUseCase<string, ISMR[]>>("GetSMRsByComplaintUseCase", GetSMRsByComplaintUseCase);
container.registerSingleton<IUseCase<{ id: string; data: UpdateSMRDto }, ISMR | null>>("UpdateSMRUseCase", UpdateSMRUseCase);
container.registerSingleton<IUseCase<SMRApprovalInput, ISMR | null>>("ApproveSMRUseCase", ApproveSMRUseCase);

container.registerSingleton<IUseCase<CreateStaffDto, IStaff>>("CreateStaffUseCase", CreateStaffUseCase);
container.registerSingleton<IUseCase<GetStaffQuery, PaginatedStaff>>("GetStaffUseCase", GetStaffUseCase);
container.registerSingleton<IUseCase<string, IStaff | null>>("GetStaffByIdUseCase", GetStaffByIdUseCase);
container.registerSingleton<IUseCase<{ id: string; data: UpdateStaffDto }, IStaff | null>>("UpdateStaffUseCase", UpdateStaffUseCase);
container.registerSingleton<IUseCase<string, boolean>>("DeleteStaffUseCase", DeleteStaffUseCase);
container.registerSingleton<IUseCase<string, StaffWorkHistoryItem[]>>("GetStaffWorkHistoryUseCase", GetStaffWorkHistoryUseCase);

