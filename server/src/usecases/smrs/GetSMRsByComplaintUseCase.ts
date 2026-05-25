import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { ISMRRepository } from "../../interfaces/repositories/ISMRRepository";
import { ISMR } from "../../interfaces/models/ISMR";

@injectable()
export class GetSMRsByComplaintUseCase implements IUseCase<string, ISMR[]> {
  constructor(
    @inject("SMRRepository")
    private _smrRepository: ISMRRepository
  ) {}

  public async execute(complaintId: string): Promise<ISMR[]> {
    return await this._smrRepository.findByComplaintId(complaintId);
  }
}
