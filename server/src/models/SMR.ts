import { Schema, model, Document } from "mongoose";
import { ISMR } from "../interfaces/models/ISMR";

export interface ISMRDocument extends Document, Omit<ISMR, "id"> {
  createdAt: Date;
  updatedAt: Date;
}

const acUnitSchema = new Schema(
  {
    type: { type: String, required: true },
    make: { type: String, required: true },
    modelNo: { type: String, required: true },
    serialNo: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    location: { type: String, required: true }
  },
  { _id: false }
);

const workDoneChecklistSchema = new Schema(
  {
    filtersCleaned: { type: Boolean, required: true, default: false },
    coilsCleaned: { type: Boolean, required: true, default: false },
    compressorCurrentChecked: { type: Boolean, required: true, default: false },
    electricalConnectionsTightened: { type: Boolean, required: true, default: false },
    gasPressureChecked: { type: Boolean, required: true, default: false }
  },
  { _id: false }
);

const approvalSchema = new Schema(
  {
    clientRepName: { type: String, required: true },
    designation: { type: String, required: true },
    signature: { type: String, required: true }, // Base64 PNG image
    hasSeal: { type: Boolean, required: true, default: false },
    date: { type: Date, required: true, default: Date.now }
  },
  { _id: false }
);

const smrSchema = new Schema<ISMRDocument>(
  {
    smrNo: { type: String, required: true, unique: true, trim: true },
    complaintId: { type: String, ref: "Complaint", default: "" },
    amcVisitId: { type: String, default: "" },
    clientId: { type: String, required: true, ref: "Client" },
    clientName: { type: String, required: true, trim: true },
    clientLocation: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    date: { type: Date, required: true, default: Date.now },
    jobNumber: { type: String, required: true, trim: true },
    natureOfComplaint: { type: String, required: true, trim: true },
    acUnits: { type: [acUnitSchema], required: true },
    serviceRendered: { type: String, required: true, default: "" },
    workDoneChecklist: { type: workDoneChecklistSchema, required: true },
    compressorCurrentValue: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Draft", "Pending Approval", "Approved", "Rejected"],
      required: true,
      default: "Pending Approval"
    },
    approval: { type: approvalSchema }
  },
  { timestamps: true }
);

export const SMRModel = model<ISMRDocument>("SMR", smrSchema);
