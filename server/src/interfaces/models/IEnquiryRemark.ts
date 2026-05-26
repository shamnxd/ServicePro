export interface IEnquiryRemark {
  id?: string;
  user: string;
  date: Date | string;
  text: string;
}

export type EnquiryActivityType =
  | "created"
  | "assigned"
  | "reassigned"
  | "status_changed"
  | "priority_changed"
  | "updated"
  | "remark_added"
  | "file_uploaded";

export interface IEnquiryActivity {
  type: EnquiryActivityType;
  message: string;
  user: string;
  date: Date | string;
}
