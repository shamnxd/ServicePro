import { IBaseRepository } from "./IBaseRepository";
import { ISMR } from "../models/ISMR";

export interface ISMRRepository extends IBaseRepository<ISMR> {
  findByComplaintId(complaintId: string): Promise<ISMR[]>;
  findByClientId(clientId: string): Promise<ISMR[]>;
}
