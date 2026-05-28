import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IQuotationRepository } from "../../interfaces/repositories/IQuotationRepository";
import { IQuotation } from "../../interfaces/models/IQuotation";
import { EditQuotationRemarkDto } from "../../dtos/quotationRemark.dto";
import { remarkKey, updateRemarkText } from "../../utils/remarkEdit";

@injectable()
export class EditQuotationRemarkUseCase
  implements
    IUseCase<
      { quotationId: string; remarkKey: string; data: EditQuotationRemarkDto; user: string },
      IQuotation | null
    >
{
  constructor(@inject("QuotationRepository") private _quotationRepository: IQuotationRepository) {}

  public async execute(params: {
    quotationId: string;
    remarkKey: string;
    data: EditQuotationRemarkDto;
    user: string;
  }): Promise<IQuotation | null> {
    const quotation = await this._quotationRepository.findById(params.quotationId);
    if (!quotation) return null;

    const existing = (quotation.remarks ?? []).map((r, i) => ({
      ...r,
      id: r.id ?? remarkKey(r, i),
    }));

    const remarks = updateRemarkText(existing, params.remarkKey, params.data.text);
    if (!remarks) return null;

    return await this._quotationRepository.update(params.quotationId, {
      remarks: remarks.map(({ id, user, date, text }) => ({ id, user, date, text })),
    });
  }
}
