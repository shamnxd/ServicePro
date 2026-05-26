import { injectable } from "tsyringe";
import { BaseRepository } from "./BaseRepository";
import {
  IEnquiryRepository,
  GetEnquiriesQuery,
  PaginatedEnquiries,
} from "../../interfaces/repositories/IEnquiryRepository";
import { IEnquiry } from "../../interfaces/models/IEnquiry";
import { EnquiryModel, IEnquiryDocument } from "../../models/Enquiry";

@injectable()
export class EnquiryRepository extends BaseRepository<IEnquiryDocument, IEnquiry> implements IEnquiryRepository {
  constructor() {
    super(EnquiryModel);
  }

  protected toDomain(doc: IEnquiryDocument): IEnquiry {
    return {
      id: doc._id.toString(),
      enquiryNo: doc.enquiryNo,
      date: doc.date,
      clientId: doc.clientId,
      clientName: doc.clientName,
      contactPerson: doc.contactPerson,
      phone: doc.phone,
      email: doc.email,
      requirement: doc.requirement,
      description: doc.description,
      status: doc.status,
      priority: doc.priority,
      assignedTo: doc.assignedTo,
      assignedStaffId: doc.assignedStaffId || undefined,
      followUpDate: doc.followUpDate ?? null,
      drawings: (doc.drawings ?? []).map((d) => ({
        name: d.name,
        storageKey: d.storageKey || undefined,
        url: d.url || undefined,
        mimeType: d.mimeType || undefined,
        size: d.size || undefined,
        uploadDate: d.uploadDate,
        uploadedBy: d.uploadedBy,
      })),
      remarks: (doc.remarks ?? []).map((r) => ({
        id: (r as { _id?: { toString(): string } })._id?.toString(),
        user: r.user,
        date: r.date,
        text: r.text,
      })),
      activityLog: (doc.activityLog ?? []).map((a) => ({
        type: a.type,
        message: a.message,
        user: a.user,
        date: a.date,
      })),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  public override async create(item: Partial<IEnquiry>): Promise<IEnquiry> {
    const year = new Date().getFullYear();
    const count = await this.model.countDocuments().exec();
    const pad = String(count + 1).padStart(3, "0");
    const enquiryNo = `ENQ-${year}-${pad}`;

    const createdDoc = new this.model({
      ...item,
      enquiryNo,
    });

    const savedDoc = await createdDoc.save();
    return this.toDomain(savedDoc);
  }

  public async findPaginated(query: GetEnquiriesQuery): Promise<PaginatedEnquiries> {
    const { search, page = 1, limit = 10, status, priority, clientId } = query;
    const mongoFilter: Record<string, unknown> = {};

    if (clientId) {
      mongoFilter.clientId = clientId;
    }

    if (search?.trim()) {
      const regex = new RegExp(search.trim(), "i");
      mongoFilter.$or = [
        { enquiryNo: regex },
        { clientName: regex },
        { contactPerson: regex },
        { requirement: regex },
        { description: regex },
      ];
    }

    if (status && status !== "all") {
      mongoFilter.status = status;
    }

    if (priority && priority !== "all") {
      mongoFilter.priority = priority;
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
