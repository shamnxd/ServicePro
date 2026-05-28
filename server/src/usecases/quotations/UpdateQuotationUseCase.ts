import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IQuotationRepository } from "../../interfaces/repositories/IQuotationRepository";
import { UpdateQuotationDto } from "../../dtos/quotation.dto";
import { IQuotation } from "../../interfaces/models/IQuotation";
import { computeQuotationTotals, normalizeLineItems } from "../../utils/quotationTotals";

@injectable()
export class UpdateQuotationUseCase
  implements IUseCase<{ id: string; data: UpdateQuotationDto }, IQuotation | null>
{
  constructor(@inject("QuotationRepository") private _quotationRepository: IQuotationRepository) {}

  public async execute(input: { id: string; data: UpdateQuotationDto }): Promise<IQuotation | null> {
    const existing = await this._quotationRepository.findById(input.id);
    if (!existing) return null;

    const { items: itemsInput, gstPercent: gstInput, ...scalarFields } = input.data;
    const patch: Partial<IQuotation> = { ...scalarFields };

    if (itemsInput) {
      const items = normalizeLineItems(itemsInput);
      const gstPercent = gstInput ?? existing.gstPercent;
      const totals = computeQuotationTotals(items, gstPercent);
      patch.items = items;
      patch.amount = totals.amount;
      patch.gst = totals.gst;
      patch.total = totals.total;
      patch.gstPercent = gstPercent;
    } else if (gstInput != null) {
      const totals = computeQuotationTotals(existing.items, gstInput);
      patch.amount = totals.amount;
      patch.gst = totals.gst;
      patch.total = totals.total;
      patch.gstPercent = gstInput;
    }

    return await this._quotationRepository.update(input.id, patch);
  }
}
