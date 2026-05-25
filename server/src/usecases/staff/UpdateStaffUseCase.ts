import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IStaffRepository } from "../../interfaces/repositories/IStaffRepository";
import { UpdateStaffDto } from "../../dtos/staff.dto";
import { IStaff } from "../../interfaces/models/IStaff";

@injectable()
export class UpdateStaffUseCase implements IUseCase<{ id: string; data: UpdateStaffDto }, IStaff | null> {
  constructor(
    @inject("StaffRepository")
    private _staffRepository: IStaffRepository
  ) {}

  public async execute(params: { id: string; data: UpdateStaffDto }): Promise<IStaff | null> {
    const data = { ...params.data };
    if (data.role && data.role !== "Custom") {
      data.customRole = "";
    }
    return await this._staffRepository.update(params.id, data);
  }
}
