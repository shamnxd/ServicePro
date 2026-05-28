import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import {
  IQuotationRepository,
  GetQuotationsQuery,
  PaginatedQuotations,
} from "../../interfaces/repositories/IQuotationRepository";

@injectable()
export class GetQuotationsUseCase implements IUseCase<GetQuotationsQuery, PaginatedQuotations> {
  constructor(@inject("QuotationRepository") private _quotationRepository: IQuotationRepository) {}

  public async execute(query: GetQuotationsQuery): Promise<PaginatedQuotations> {
    return await this._quotationRepository.findPaginated(query);
  }
}
