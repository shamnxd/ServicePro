import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IStaffRepository } from "../../interfaces/repositories/IStaffRepository";
import { CreateStaffDto } from "../../dtos/staff.dto";
import { IStaff } from "../../interfaces/models/IStaff";

@injectable()
export class CreateStaffUseCase implements IUseCase<CreateStaffDto, IStaff> {
  constructor(
    @inject("StaffRepository")
    private _staffRepository: IStaffRepository
  ) {}

  public async execute(dto: CreateStaffDto): Promise<IStaff> {
    return await this._staffRepository.create({
      ...dto,
      customRole: dto.role === "Custom" ? dto.customRole : ""
    });
  }
}
