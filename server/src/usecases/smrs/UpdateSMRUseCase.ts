import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { ISMRRepository } from "../../interfaces/repositories/ISMRRepository";
import { UpdateSMRDto } from "../../dtos/smr.dto";
import { ISMR } from "../../interfaces/models/ISMR";

@injectable()
export class UpdateSMRUseCase implements IUseCase<{ id: string; data: UpdateSMRDto }, ISMR | null> {
  constructor(
    @inject("SMRRepository")
    private _smrRepository: ISMRRepository
  ) {}

  public async execute(params: { id: string; data: UpdateSMRDto }): Promise<ISMR | null> {
    return await this._smrRepository.update(params.id, params.data);
  }
}
