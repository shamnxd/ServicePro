import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IAmcRepository } from "../../interfaces/repositories/IAmcRepository";
import { IAmc } from "../../interfaces/models/IAmc";
import { EditEnquiryRemarkDto } from "../../dtos/enquiryRemark.dto";
import { remarkKey, updateRemarkText } from "../../utils/remarkEdit";

@injectable()
export class EditAmcRemarkUseCase
  implements
    IUseCase<
      { amcId: string; remarkKey: string; data: EditEnquiryRemarkDto; user: string },
      IAmc | null
    >
{
  constructor(@inject("AmcRepository") private _amcRepository: IAmcRepository) {}

  public async execute(params: {
    amcId: string;
    remarkKey: string;
    data: EditEnquiryRemarkDto;
    user: string;
  }): Promise<IAmc | null> {
    const amc = await this._amcRepository.findById(params.amcId);
    if (!amc) return null;

    const existing = (amc.remarks ?? []).map((r, i) => ({
      ...r,
      id: (r as { id?: string }).id ?? remarkKey(r, i),
    }));

    const remarks = updateRemarkText(existing, params.remarkKey, params.data.text);
    if (!remarks) return null;

    return await this._amcRepository.update(params.amcId, {
      remarks: remarks.map(({ id, user, date, text }) => ({
        user,
        date: date instanceof Date ? date : new Date(date),
        text,
        ...(id ? { id } : {}),
      })),
    });
  }
}
