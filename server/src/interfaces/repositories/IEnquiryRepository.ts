import { IEnquiry } from "../models/IEnquiry";
import { IBaseRepository } from "./IBaseRepository";

export interface GetEnquiriesQuery {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  clientId?: string;
}

export interface PaginatedEnquiries {
  data: IEnquiry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IEnquiryRepository extends IBaseRepository<IEnquiry> {
  findPaginated(query: GetEnquiriesQuery): Promise<PaginatedEnquiries>;
}
