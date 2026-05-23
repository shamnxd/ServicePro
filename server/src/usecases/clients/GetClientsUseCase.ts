import { injectable, inject } from "tsyringe";
import { IUseCase } from "../../interfaces/usecases/IUseCase";
import { IClientRepository, GetClientsQuery, PaginatedClients } from "../../interfaces/repositories/IClientRepository";

@injectable()
export class GetClientsUseCase implements IUseCase<GetClientsQuery, PaginatedClients> {
  constructor(
    @inject("ClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  public async execute(query: GetClientsQuery): Promise<PaginatedClients> {
    return await this._clientRepository.findPaginated(query);
  }
}

