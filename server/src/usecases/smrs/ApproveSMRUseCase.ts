import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { ISMRRepository } from "../../interfaces/repositories/ISMRRepository";
import { IComplaintRepository } from "../../interfaces/repositories/IComplaintRepository";
import { ISMR } from "../../interfaces/models/ISMR";

export interface SMRApprovalInput {
  id: string;
  clientRepName: string;
}

@injectable()
export class ApproveSMRUseCase implements IUseCase<SMRApprovalInput, ISMR | null> {
  constructor(
    @inject("SMRRepository")
    private _smrRepository: ISMRRepository,
    @inject("ComplaintRepository")
    private _complaintRepository: IComplaintRepository
  ) {}

  public async execute(params: SMRApprovalInput): Promise<ISMR | null> {
    const { id, clientRepName } = params;

    const smr = await this._smrRepository.update(id, {
      status: "Approved",
      approval: {
        clientRepName,
        designation: "",
        signature: "Approved by client representative",
        hasSeal: false,
        date: new Date()
      }
    });

    if (smr && smr.complaintId) {
      // Auto-transition the complaint to "Resolved"
      await this._complaintRepository.update(smr.complaintId, { status: "Resolved" });
    }

    return smr;
  }
}
