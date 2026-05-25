import { injectable } from "tsyringe";
import { BaseRepository } from "./BaseRepository";
import { ISMRRepository } from "../../interfaces/repositories/ISMRRepository";
import { ISMR } from "../../interfaces/models/ISMR";
import { SMRModel, ISMRDocument } from "../../models/SMR";

@injectable()
export class SMRRepository extends BaseRepository<ISMRDocument, ISMR> implements ISMRRepository {
  constructor() {
    super(SMRModel);
  }

  protected toDomain(doc: ISMRDocument): ISMR {
    return {
      id: doc._id.toString(),
      smrNo: doc.smrNo,
      complaintId: doc.complaintId,
      clientId: doc.clientId,
      clientName: doc.clientName,
      clientLocation: doc.clientLocation,
      contactName: doc.contactName,
      date: doc.date,
      jobNumber: doc.jobNumber,
      natureOfComplaint: doc.natureOfComplaint,
      acUnits: doc.acUnits.map(unit => ({
        type: unit.type,
        make: unit.make,
        modelNo: unit.modelNo,
        serialNo: unit.serialNo,
        quantity: unit.quantity,
        location: unit.location
      })),
      serviceRendered: doc.serviceRendered,
      workDoneChecklist: {
        filtersCleaned: doc.workDoneChecklist.filtersCleaned,
        coilsCleaned: doc.workDoneChecklist.coilsCleaned,
        compressorCurrentChecked: doc.workDoneChecklist.compressorCurrentChecked,
        electricalConnectionsTightened: doc.workDoneChecklist.electricalConnectionsTightened,
        gasPressureChecked: doc.workDoneChecklist.gasPressureChecked
      },
      compressorCurrentValue: doc.compressorCurrentValue,
      status: doc.status,
      approval: doc.approval ? {
        clientRepName: doc.approval.clientRepName,
        designation: doc.approval.designation,
        signature: doc.approval.signature,
        hasSeal: doc.approval.hasSeal,
        date: doc.approval.date
      } : undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  public override async create(item: Partial<ISMR>): Promise<ISMR> {
    const year = new Date().getFullYear();
    const count = await this.model.countDocuments().exec();
    const pad = String(count + 1).padStart(3, "0");
    const smrNo = `SMR-${year}-${pad}`;

    const createdDoc = new this.model({
      ...item,
      smrNo,
      jobNumber: item.jobNumber || smrNo
    });

    const savedDoc = await createdDoc.save();
    return this.toDomain(savedDoc);
  }

  public async findByComplaintId(complaintId: string): Promise<ISMR[]> {
    const docs = await this.model.find({ complaintId }).sort({ createdAt: -1 }).exec();
    return docs.map(doc => this.toDomain(doc));
  }

  public async findByClientId(clientId: string): Promise<ISMR[]> {
    const docs = await this.model.find({ clientId }).sort({ createdAt: -1 }).exec();
    return docs.map(doc => this.toDomain(doc));
  }
}
