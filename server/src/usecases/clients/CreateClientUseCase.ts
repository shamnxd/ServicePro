import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IClientRepository } from "../../interfaces/repositories/IClientRepository";
import { CreateClientDto } from "../../dtos/client.dto";
import { IClient } from "../../interfaces/models/IClient";

@injectable()
export class CreateClientUseCase implements IUseCase<CreateClientDto, IClient> {
  constructor(
    @inject("ClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  public async execute(dto: CreateClientDto): Promise<IClient> {
    return await this._clientRepository.create(dto);
  }
}
