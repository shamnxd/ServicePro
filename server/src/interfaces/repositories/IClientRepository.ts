import { IBaseRepository } from "./IBaseRepository";
import { IClient } from "../models/IClient";

export interface GetClientsQuery {
  search?: string;
  page?: number;
  limit?: number;
  filter?: "all" | "active-amc" | "expired-amc" | "active-complaints" | "active-enquiries";
  companyNames?: string[];
}

export interface PaginatedClients {
  data: IClient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IClientRepository extends IBaseRepository<IClient> {
  findPaginated(query: GetClientsQuery): Promise<PaginatedClients>;
}
