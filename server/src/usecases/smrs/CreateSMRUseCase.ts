import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { ISMRRepository } from "../../interfaces/repositories/ISMRRepository";
import { IComplaintRepository } from "../../interfaces/repositories/IComplaintRepository";
import { CreateSMRDto } from "../../dtos/smr.dto";
import { ISMR } from "../../interfaces/models/ISMR";
import { BadRequestError } from "../../errors/BadRequestError";

@injectable()
export class CreateSMRUseCase implements IUseCase<CreateSMRDto, ISMR> {
  constructor(
    @inject("SMRRepository")
    private _smrRepository: ISMRRepository,
    @inject("ComplaintRepository")
    private _complaintRepository: IComplaintRepository
  ) {}

  public async execute(dto: CreateSMRDto): Promise<ISMR> {
    if (dto.complaintId) {
      const existing = await this._smrRepository.findByComplaintId(dto.complaintId);
      if (existing.length > 0) {
        throw new BadRequestError("An SMR report already exists for this complaint");
      }
    }

    const smr = await this._smrRepository.create(dto);

    // If SMR is created for a complaint, auto-transition the complaint to "In Progress"
    if (smr.complaintId) {
      const complaint = await this._complaintRepository.findById(smr.complaintId);
      if (complaint && complaint.status === "Pending") {
        await this._complaintRepository.update(smr.complaintId, { status: "In Progress" });
      }
    }

    return smr;
  }
}
