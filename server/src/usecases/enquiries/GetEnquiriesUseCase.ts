import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import {
  IEnquiryRepository,
  GetEnquiriesQuery,
  PaginatedEnquiries,
} from "../../interfaces/repositories/IEnquiryRepository";

@injectable()
export class GetEnquiriesUseCase implements IUseCase<GetEnquiriesQuery, PaginatedEnquiries> {
  constructor(
    @inject("EnquiryRepository")
    private _enquiryRepository: IEnquiryRepository,
  ) {}

  public async execute(query: GetEnquiriesQuery): Promise<PaginatedEnquiries> {
    return await this._enquiryRepository.findPaginated(query);
  }
}
