import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IStaffRepository, GetStaffQuery, PaginatedStaff } from "../../interfaces/repositories/IStaffRepository";

@injectable()
export class GetStaffUseCase implements IUseCase<GetStaffQuery, PaginatedStaff> {
  constructor(
    @inject("StaffRepository")
    private _staffRepository: IStaffRepository
  ) {}

  public async execute(query: GetStaffQuery): Promise<PaginatedStaff> {
    return await this._staffRepository.findPaginated(query);
  }
}
