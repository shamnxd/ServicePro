import { z } from "zod";

export const ACUnitSchema = z.object({
  type: z.string().min(1, "AC type is required"),
  make: z.string().min(1, "Make is required"),
  modelNo: z.string().min(1, "Model number is required"),
  serialNo: z.string().min(1, "Serial number is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  location: z.string().min(1, "AC unit location is required")
});

export const WorkDoneChecklistSchema = z.object({
  filtersCleaned: z.boolean().default(false),
  coilsCleaned: z.boolean().default(false),
  compressorCurrentChecked: z.boolean().default(false),
  electricalConnectionsTightened: z.boolean().default(false),
  gasPressureChecked: z.boolean().default(false)
});

export const SMRApprovalSchema = z.object({
  clientRepName: z.string().min(1, "Client representative name is required"),
  designation: z.string().min(1, "Designation is required"),
  signature: z.string().min(1, "Signature canvas drawing is required"),
  hasSeal: z.boolean().default(false),
  date: z.string().transform(val => new Date(val)).or(z.date()).optional().default(() => new Date())
});

export const CreateSMRSchema = z.object({
  complaintId: z.string().optional().or(z.literal("")),
  clientId: z.string().min(1, "Client ID is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientLocation: z.string().min(1, "Client location is required"),
  contactName: z.string().min(1, "Contact name is required"),
  date: z.string().transform(val => new Date(val)).or(z.date()).optional().default(() => new Date()),
  jobNumber: z.string().optional(),
  natureOfComplaint: z.string().min(1, "Nature of complaint is required"),
  acUnits: z.array(ACUnitSchema).min(1, "At least one AC unit record must be present"),
  serviceRendered: z.string().min(1, "Service rendered notes are required"),
  workDoneChecklist: WorkDoneChecklistSchema,
  compressorCurrentValue: z.string().optional().default(""),
  status: z.enum(["Draft", "Pending Approval", "Approved", "Rejected"]).optional().default("Pending Approval"),
  approval: SMRApprovalSchema.optional()
});

export type CreateSMRDto = z.infer<typeof CreateSMRSchema>;

export const UpdateSMRSchema = CreateSMRSchema.partial();

export type UpdateSMRDto = z.infer<typeof UpdateSMRSchema>;
