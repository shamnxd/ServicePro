import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IComplaintRepository } from "../../interfaces/repositories/IComplaintRepository";
import { IStaffRepository } from "../../interfaces/repositories/IStaffRepository";
import { CreateComplaintDto } from "../../dtos/complaint.dto";
import { IComplaint } from "../../interfaces/models/IComplaint";
import { resolveComplaintStaffAssignment } from "../../utils/resolveComplaintStaffAssignment";

@injectable()
export class CreateComplaintUseCase implements IUseCase<CreateComplaintDto, IComplaint> {
  constructor(
    @inject("ComplaintRepository")
    private _complaintRepository: IComplaintRepository,
    @inject("StaffRepository")
    private _staffRepository: IStaffRepository
  ) {}

  public async execute(dto: CreateComplaintDto): Promise<IComplaint> {
    const assignment = await resolveComplaintStaffAssignment(
      this._staffRepository,
      dto.assignedStaffIds
    );

    return await this._complaintRepository.create({
      ...dto,
      assignedStaffIds: assignment.assignedStaffIds,
      assignedTo: assignment.assignedTo
    });
  }
}
