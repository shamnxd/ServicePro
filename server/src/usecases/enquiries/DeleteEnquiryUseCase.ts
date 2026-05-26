import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IEnquiryRepository } from "../../interfaces/repositories/IEnquiryRepository";

@injectable()
export class DeleteEnquiryUseCase implements IUseCase<string, boolean> {
  constructor(
    @inject("EnquiryRepository")
    private _enquiryRepository: IEnquiryRepository,
  ) {}

  public async execute(id: string): Promise<boolean> {
    return await this._enquiryRepository.delete(id);
  }
}
