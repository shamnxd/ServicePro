import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IEnquiryRepository } from "../../interfaces/repositories/IEnquiryRepository";
import { IStaffRepository } from "../../interfaces/repositories/IStaffRepository";
import { CreateEnquiryDto } from "../../dtos/enquiry.dto";
import { IEnquiry } from "../../interfaces/models/IEnquiry";
import { appendEnquiryActivity } from "../../utils/enquiryActivity";

@injectable()
export class CreateEnquiryUseCase
  implements IUseCase<{ data: CreateEnquiryDto; user: string }, IEnquiry>
{
  constructor(
    @inject("EnquiryRepository")
    private _enquiryRepository: IEnquiryRepository,
    @inject("StaffRepository")
    private _staffRepository: IStaffRepository,
  ) {}

  public async execute(input: { data: CreateEnquiryDto; user: string }): Promise<IEnquiry> {
    const dto = input.data;
    const user = input.user || "Admin";
    let assignedTo = dto.assignedTo ?? "";
    const assignedStaffId = dto.assignedStaffId?.trim() ?? "";

    if (assignedStaffId) {
      const staff = await this._staffRepository.findById(assignedStaffId);
      if (staff) {
        assignedTo = staff.fullName;
      }
    }

    let activityLog = appendEnquiryActivity(undefined, "created", "Enquiry created", user);
    if (assignedStaffId && assignedTo) {
      activityLog = appendEnquiryActivity(activityLog, "assigned", `Assigned to ${assignedTo}`, user);
    }

    return await this._enquiryRepository.create({
      ...dto,
      assignedTo,
      assignedStaffId: assignedStaffId || undefined,
      remarks: [],
      activityLog,
    });
  }
}
