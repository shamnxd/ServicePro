import { IBaseRepository } from "./IBaseRepository";
import { IStaff } from "../models/IStaff";

export interface GetStaffQuery {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  employmentType?: string;
  activeOnly?: boolean;
}

export interface PaginatedStaff {
  data: IStaff[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IStaffRepository extends IBaseRepository<IStaff> {
  findPaginated(query: GetStaffQuery): Promise<PaginatedStaff>;
  findByIds(ids: string[]): Promise<IStaff[]>;
}
