import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IQuotationRepository } from "../../interfaces/repositories/IQuotationRepository";
import { IQuotation } from "../../interfaces/models/IQuotation";
import { AddQuotationRemarkDto } from "../../dtos/quotationRemark.dto";

@injectable()
export class AddQuotationRemarkUseCase
  implements IUseCase<{ quotationId: string; data: AddQuotationRemarkDto; user: string }, IQuotation | null>
{
  constructor(@inject("QuotationRepository") private _quotationRepository: IQuotationRepository) {}

  public async execute(params: {
    quotationId: string;
    data: AddQuotationRemarkDto;
    user: string;
  }): Promise<IQuotation | null> {
    const quotation = await this._quotationRepository.findById(params.quotationId);
    if (!quotation) return null;

    const remarks = [
      ...(quotation.remarks ?? []),
      {
        user: params.user || "Admin",
        date: new Date(),
        text: params.data.text.trim(),
      },
    ];

    return await this._quotationRepository.update(params.quotationId, { remarks });
  }
}
