import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IClientRepository } from "../../interfaces/repositories/IClientRepository";
import { AppError } from "../../errors/AppError";
import { StatusCode } from "../../constants/statusCodes";

@injectable()
export class DeleteClientUseCase implements IUseCase<string, boolean> {
  constructor(
    @inject("ClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  public async execute(id: string): Promise<boolean> {
    const result = await this._clientRepository.delete(id);
    if (!result) {
      throw new AppError("Client not found", StatusCode.NOT_FOUND);
    }
    return true;
  }
}
