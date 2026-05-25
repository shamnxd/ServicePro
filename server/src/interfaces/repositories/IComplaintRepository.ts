import { IBaseRepository } from "./IBaseRepository";
import { IComplaint } from "../models/IComplaint";
import { StaffWorkHistoryItem } from "../models/IStaff";

export interface GetComplaintsQuery {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  clientId?: string;
}

export interface PaginatedComplaints {
  data: IComplaint[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IComplaintRepository extends IBaseRepository<IComplaint> {
  findPaginated(query: GetComplaintsQuery): Promise<PaginatedComplaints>;
  findWorkHistoryByStaffId(staffId: string, staffName?: string): Promise<StaffWorkHistoryItem[]>;
}
