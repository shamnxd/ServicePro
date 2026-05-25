import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IStaffRepository } from "../../interfaces/repositories/IStaffRepository";

@injectable()
export class DeleteStaffUseCase implements IUseCase<string, boolean> {
  constructor(
    @inject("StaffRepository")
    private _staffRepository: IStaffRepository
  ) {}

  public async execute(id: string): Promise<boolean> {
    return await this._staffRepository.delete(id);
  }
}
