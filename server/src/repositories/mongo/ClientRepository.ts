import { injectable } from "tsyringe";
import { BaseRepository } from "./BaseRepository";
import { IClientRepository, GetClientsQuery, PaginatedClients } from "../../interfaces/repositories/IClientRepository";
import { IClient } from "../../interfaces/models/IClient";
import { ClientModel, IClientDocument } from "../../models/Client";

@injectable()
export class ClientRepository extends BaseRepository<IClientDocument, IClient> implements IClientRepository {
  constructor() {
    super(ClientModel);
  }

  protected toDomain(clientDoc: IClientDocument): IClient {
    return {
      id: clientDoc._id.toString(),
      companyName: clientDoc.companyName,
      contactPerson: clientDoc.contactPerson,
      phone: clientDoc.phone,
      email: clientDoc.email,
      gst: clientDoc.gst,
      city: clientDoc.city,
      address: clientDoc.address,
      projectsCount: clientDoc.projectsCount,
      amcStatus: clientDoc.amcStatus,
      createdAt: clientDoc.createdAt,
      updatedAt: clientDoc.updatedAt
    };
  }

  public async findPaginated(query: GetClientsQuery): Promise<PaginatedClients> {
    const { search, page = 1, limit = 10, filter, companyNames } = query;

    // Build the MongoDB filter object
    const mongoFilter: Record<string, any> = {};

    // Text search across name, contact person, city
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      mongoFilter["$or"] = [
        { companyName: regex },
        { contactPerson: regex },
        { city: regex },
        { email: regex },
      ];
    }

    // AMC-based filter
    if (filter === "active-amc") {
      mongoFilter["amcStatus"] = "Active";
    } else if (filter === "expired-amc") {
      mongoFilter["amcStatus"] = "Expired";
    }

    // Complaints / Enquiries filter — match by company names list from frontend
    if ((filter === "active-complaints" || filter === "active-enquiries") && companyNames && companyNames.length > 0) {
      mongoFilter["companyName"] = { $in: companyNames };
    } else if ((filter === "active-complaints" || filter === "active-enquiries") && (!companyNames || companyNames.length === 0)) {
      // No companies match, return empty result
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }

    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      this.model.find(mongoFilter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.model.countDocuments(mongoFilter).exec(),
    ]);

    return {
      data: docs.map((doc) => this.toDomain(doc)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

