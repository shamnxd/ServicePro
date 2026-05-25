import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { ISMRRepository } from "../../interfaces/repositories/ISMRRepository";
import { ISMR } from "../../interfaces/models/ISMR";

@injectable()
export class GetSMRByIdUseCase implements IUseCase<string, ISMR | null> {
  constructor(
    @inject("SMRRepository")
    private _smrRepository: ISMRRepository
  ) {}

  public async execute(id: string): Promise<ISMR | null> {
    return await this._smrRepository.findById(id);
  }
}
