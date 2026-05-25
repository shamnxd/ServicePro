import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IComplaintRepository } from "../../interfaces/repositories/IComplaintRepository";
import { IStaffRepository } from "../../interfaces/repositories/IStaffRepository";
import { StaffWorkHistoryItem } from "../../interfaces/models/IStaff";

@injectable()
export class GetStaffWorkHistoryUseCase implements IUseCase<string, StaffWorkHistoryItem[]> {
  constructor(
    @inject("ComplaintRepository")
    private _complaintRepository: IComplaintRepository,
    @inject("StaffRepository")
    private _staffRepository: IStaffRepository
  ) {}

  public async execute(staffId: string): Promise<StaffWorkHistoryItem[]> {
    const staff = await this._staffRepository.findById(staffId);
    return await this._complaintRepository.findWorkHistoryByStaffId(
      staffId,
      staff?.fullName
    );
  }
}
