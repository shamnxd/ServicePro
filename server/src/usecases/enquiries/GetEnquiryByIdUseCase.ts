import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IEnquiryRepository } from "../../interfaces/repositories/IEnquiryRepository";
import { IEnquiry } from "../../interfaces/models/IEnquiry";

@injectable()
export class GetEnquiryByIdUseCase implements IUseCase<string, IEnquiry | null> {
  constructor(
    @inject("EnquiryRepository")
    private _enquiryRepository: IEnquiryRepository,
  ) {}

  public async execute(id: string): Promise<IEnquiry | null> {
    return await this._enquiryRepository.findById(id);
  }
}
