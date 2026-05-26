export interface IACUnit {
  type: string;
  make: string;
  modelNo: string;
  serialNo: string;
  quantity: number;
  location: string;
}

export interface IWorkDoneChecklist {
  filtersCleaned: boolean;
  coilsCleaned: boolean;
  compressorCurrentChecked: boolean;
  electricalConnectionsTightened: boolean;
  gasPressureChecked: boolean;
}

export interface ISMRApproval {
  clientRepName: string;
  designation: string;
  signature: string; // Base64 PNG image string
  hasSeal: boolean;
  date: Date;
}

export interface ISMR {
  id?: string;
  smrNo: string;
  complaintId?: string;
  amcVisitId?: string;
  clientId: string;
  clientName: string;
  clientLocation: string;
  contactName: string;
  date: Date;
  jobNumber: string;
  natureOfComplaint: string;
  acUnits: IACUnit[];
  serviceRendered: string;
  workDoneChecklist: IWorkDoneChecklist;
  compressorCurrentValue: string;
  status: "Draft" | "Pending Approval" | "Approved" | "Rejected";
  approval?: ISMRApproval;
  createdAt?: Date;
  updatedAt?: Date;
}
