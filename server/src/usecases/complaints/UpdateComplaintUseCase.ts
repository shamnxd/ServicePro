import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IComplaintRepository } from "../../interfaces/repositories/IComplaintRepository";
import { IStaffRepository } from "../../interfaces/repositories/IStaffRepository";
import { UpdateComplaintDto } from "../../dtos/complaint.dto";
import { IComplaint } from "../../interfaces/models/IComplaint";
import { resolveComplaintStaffAssignment } from "../../utils/resolveComplaintStaffAssignment";

@injectable()
export class UpdateComplaintUseCase implements IUseCase<{ id: string; data: UpdateComplaintDto }, IComplaint | null> {
  constructor(
    @inject("ComplaintRepository")
    private _complaintRepository: IComplaintRepository,
    @inject("StaffRepository")
    private _staffRepository: IStaffRepository
  ) {}

  public async execute(params: { id: string; data: UpdateComplaintDto }): Promise<IComplaint | null> {
    const updateData = { ...params.data };

    if (params.data.assignedStaffIds !== undefined) {
      const assignment = await resolveComplaintStaffAssignment(
        this._staffRepository,
        params.data.assignedStaffIds
      );
      updateData.assignedStaffIds = assignment.assignedStaffIds;
      updateData.assignedTo = assignment.assignedTo;
    }

    return await this._complaintRepository.update(params.id, updateData);
  }
}
