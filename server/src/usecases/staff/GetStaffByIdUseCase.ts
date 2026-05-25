import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IStaffRepository } from "../../interfaces/repositories/IStaffRepository";
import { IStaff } from "../../interfaces/models/IStaff";

@injectable()
export class GetStaffByIdUseCase implements IUseCase<string, IStaff | null> {
  constructor(
    @inject("StaffRepository")
    private _staffRepository: IStaffRepository
  ) {}

  public async execute(id: string): Promise<IStaff | null> {
    return await this._staffRepository.findById(id);
  }
}
