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

import { IAmcRepository, GetAmcQuery, PaginatedAmc } from "../interfaces/repositories/IAmcRepository";
import { AmcRepository } from "../repositories/mongo/AmcRepository";
import { IAmc } from "../interfaces/models/IAmc";
import { CreateAmcDto, UpdateAmcDto } from "../dtos/amc.dto";
import { CreateAmcUseCase } from "../usecases/amc/CreateAmcUseCase";
import { GetAmcUseCase } from "../usecases/amc/GetAmcUseCase";
import { GetAmcByIdUseCase } from "../usecases/amc/GetAmcByIdUseCase";
import { UpdateAmcUseCase } from "../usecases/amc/UpdateAmcUseCase";
import { DeleteAmcUseCase } from "../usecases/amc/DeleteAmcUseCase";
import { IAmcVisitRepository } from "../interfaces/repositories/IAmcVisitRepository";
import { AmcVisitRepository } from "../repositories/mongo/AmcVisitRepository";
import { IAmcVisit } from "../interfaces/models/IAmcVisit";
import { ScheduleAmcVisitDto, UpdateAmcVisitDto } from "../dtos/amcVisit.dto";
import { GetAmcVisitsUseCase } from "../usecases/amc/GetAmcVisitsUseCase";
import { ScheduleAmcVisitUseCase } from "../usecases/amc/ScheduleAmcVisitUseCase";
import { UpdateAmcVisitUseCase } from "../usecases/amc/UpdateAmcVisitUseCase";
import { AddAmcRemarkUseCase } from "../usecases/amc/AddAmcRemarkUseCase";
import { RecordAmcPaymentUseCase } from "../usecases/amc/RecordAmcPaymentUseCase";
import { AddAmcRemarkDto, RecordAmcPaymentDto } from "../dtos/amcRemark.dto";

import { IEnquiryRepository, GetEnquiriesQuery, PaginatedEnquiries } from "../interfaces/repositories/IEnquiryRepository";
import { EnquiryRepository } from "../repositories/mongo/EnquiryRepository";
import { IEnquiry } from "../interfaces/models/IEnquiry";
import { CreateEnquiryDto, UpdateEnquiryDto } from "../dtos/enquiry.dto";
import { CreateEnquiryUseCase } from "../usecases/enquiries/CreateEnquiryUseCase";
import { GetEnquiriesUseCase } from "../usecases/enquiries/GetEnquiriesUseCase";
import { GetEnquiryByIdUseCase } from "../usecases/enquiries/GetEnquiryByIdUseCase";
import { UpdateEnquiryUseCase } from "../usecases/enquiries/UpdateEnquiryUseCase";
import { DeleteEnquiryUseCase } from "../usecases/enquiries/DeleteEnquiryUseCase";
import { AddEnquiryRemarkUseCase } from "../usecases/enquiries/AddEnquiryRemarkUseCase";
import { EditEnquiryRemarkUseCase } from "../usecases/enquiries/EditEnquiryRemarkUseCase";
import { EditAmcRemarkUseCase } from "../usecases/amc/EditAmcRemarkUseCase";
import { AddEnquiryDrawingUseCase, AddEnquiryDrawingInput } from "../usecases/enquiries/AddEnquiryDrawingUseCase";
import { AddEnquiryRemarkDto, EditEnquiryRemarkDto } from "../dtos/enquiryRemark.dto";

// Register repositories
container.registerSingleton<IUserRepository>("UserRepository", UserRepository);
container.registerSingleton<IClientRepository>("ClientRepository", ClientRepository);
container.registerSingleton<IComplaintRepository>("ComplaintRepository", ComplaintRepository);
container.registerSingleton<ISMRRepository>("SMRRepository", SMRRepository);
container.registerSingleton<IStaffRepository>("StaffRepository", StaffRepository);
container.registerSingleton<IAmcRepository>("AmcRepository", AmcRepository);
container.registerSingleton<IAmcVisitRepository>("AmcVisitRepository", AmcVisitRepository);
container.registerSingleton<IEnquiryRepository>("EnquiryRepository", EnquiryRepository);

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

container.registerSingleton<IUseCase<CreateAmcDto, IAmc>>("CreateAmcUseCase", CreateAmcUseCase);
container.registerSingleton<IUseCase<GetAmcQuery, PaginatedAmc>>("GetAmcUseCase", GetAmcUseCase);
container.registerSingleton<IUseCase<string, IAmc | null>>("GetAmcByIdUseCase", GetAmcByIdUseCase);
container.registerSingleton<IUseCase<{ id: string; data: UpdateAmcDto }, IAmc | null>>("UpdateAmcUseCase", UpdateAmcUseCase);
container.registerSingleton<IUseCase<string, boolean>>("DeleteAmcUseCase", DeleteAmcUseCase);
container.registerSingleton<IUseCase<string, IAmcVisit[]>>("GetAmcVisitsUseCase", GetAmcVisitsUseCase);
container.registerSingleton<IUseCase<{ amcId: string; data: ScheduleAmcVisitDto }, IAmcVisit>>(
  "ScheduleAmcVisitUseCase",
  ScheduleAmcVisitUseCase
);
container.registerSingleton<
  IUseCase<{ amcId: string; visitId: string; data: UpdateAmcVisitDto }, IAmcVisit | null>
>("UpdateAmcVisitUseCase", UpdateAmcVisitUseCase);
container.registerSingleton<
  IUseCase<{ amcId: string; data: AddAmcRemarkDto; user: string }, IAmc | null>
>("AddAmcRemarkUseCase", AddAmcRemarkUseCase);
container.registerSingleton<
  IUseCase<{ amcId: string; data: RecordAmcPaymentDto; user: string }, IAmc | null>
>("RecordAmcPaymentUseCase", RecordAmcPaymentUseCase);

container.registerSingleton<IUseCase<{ data: CreateEnquiryDto; user: string }, IEnquiry>>(
  "CreateEnquiryUseCase",
  CreateEnquiryUseCase,
);
container.registerSingleton<IUseCase<GetEnquiriesQuery, PaginatedEnquiries>>("GetEnquiriesUseCase", GetEnquiriesUseCase);
container.registerSingleton<IUseCase<string, IEnquiry | null>>("GetEnquiryByIdUseCase", GetEnquiryByIdUseCase);
container.registerSingleton<
  IUseCase<{ id: string; data: UpdateEnquiryDto; user: string }, IEnquiry | null>
>("UpdateEnquiryUseCase", UpdateEnquiryUseCase);
container.registerSingleton<IUseCase<string, boolean>>("DeleteEnquiryUseCase", DeleteEnquiryUseCase);
container.registerSingleton<
  IUseCase<{ enquiryId: string; data: AddEnquiryRemarkDto; user: string }, IEnquiry | null>
>("AddEnquiryRemarkUseCase", AddEnquiryRemarkUseCase);
container.registerSingleton<IUseCase<AddEnquiryDrawingInput, IEnquiry | null>>(
  "AddEnquiryDrawingUseCase",
  AddEnquiryDrawingUseCase,
);
container.registerSingleton<
  IUseCase<{ enquiryId: string; remarkKey: string; data: EditEnquiryRemarkDto; user: string }, IEnquiry | null>
>("EditEnquiryRemarkUseCase", EditEnquiryRemarkUseCase);
container.registerSingleton<
  IUseCase<{ amcId: string; remarkKey: string; data: EditEnquiryRemarkDto; user: string }, IAmc | null>
>("EditAmcRemarkUseCase", EditAmcRemarkUseCase);

