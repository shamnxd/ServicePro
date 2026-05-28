import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IQuotationRepository } from "../../interfaces/repositories/IQuotationRepository";
import { IQuotation } from "../../interfaces/models/IQuotation";

@injectable()
export class GetQuotationByIdUseCase implements IUseCase<string, IQuotation | null> {
  constructor(@inject("QuotationRepository") private _quotationRepository: IQuotationRepository) {}

  public async execute(id: string): Promise<IQuotation | null> {
    return await this._quotationRepository.findById(id);
  }
}
