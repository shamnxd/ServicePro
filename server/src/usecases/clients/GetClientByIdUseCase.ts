import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IClientRepository } from "../../interfaces/repositories/IClientRepository";
import { IClient } from "../../interfaces/models/IClient";

@injectable()
export class GetClientByIdUseCase implements IUseCase<string, IClient | null> {
  constructor(
    @inject("ClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  public async execute(id: string): Promise<IClient | null> {
    return await this._clientRepository.findById(id);
  }
}
