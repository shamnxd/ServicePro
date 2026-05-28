import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IQuotationRepository } from "../../interfaces/repositories/IQuotationRepository";

@injectable()
export class DeleteQuotationUseCase implements IUseCase<string, boolean> {
  constructor(@inject("QuotationRepository") private _quotationRepository: IQuotationRepository) {}

  public async execute(id: string): Promise<boolean> {
    return await this._quotationRepository.delete(id);
  }
}
