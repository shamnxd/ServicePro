import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IEnquiryRepository } from "../../interfaces/repositories/IEnquiryRepository";
import { IStaffRepository } from "../../interfaces/repositories/IStaffRepository";
import { UpdateEnquiryDto } from "../../dtos/enquiry.dto";
import { IEnquiry } from "../../interfaces/models/IEnquiry";
import { buildUpdateActivities } from "../../utils/enquiryActivity";

@injectable()
export class UpdateEnquiryUseCase
  implements IUseCase<{ id: string; data: UpdateEnquiryDto; user: string }, IEnquiry | null>
{
  constructor(
    @inject("EnquiryRepository")
    private _enquiryRepository: IEnquiryRepository,
    @inject("StaffRepository")
    private _staffRepository: IStaffRepository,
  ) {}

  public async execute(input: {
    id: string;
    data: UpdateEnquiryDto;
    user: string;
  }): Promise<IEnquiry | null> {
    const { id, data, user } = input;
    const existing = await this._enquiryRepository.findById(id);
    if (!existing) return null;

    const { remarks: _remarks, activityLog: _activity, ...rawPatch } = data as UpdateEnquiryDto & {
      remarks?: unknown;
      activityLog?: unknown;
    };
    const patch = { ...rawPatch };

    if (data.assignedStaffId !== undefined) {
      const staffId = String(data.assignedStaffId || "").trim();
      if (staffId) {
        const staff = await this._staffRepository.findById(staffId);
        patch.assignedTo = staff?.fullName ?? existing.assignedTo;
        patch.assignedStaffId = staffId;
      } else {
        patch.assignedTo = "";
        patch.assignedStaffId = "";
      }
    }

    const merged: IEnquiry = { ...existing, ...patch };
    const newActivities = buildUpdateActivities(existing, merged, user || "Admin");
    const activityLog = [...(existing.activityLog ?? []), ...newActivities];

    return await this._enquiryRepository.update(id, { ...patch, activityLog });
  }
}
