export enum AppRoute {
  LOGIN = "/login",
  DASHBOARD = "/",
  KANBAN = "/kanban",
  CLIENTS = "/clients",
  CLIENT_DETAIL = "/clients/:id",
  CLIENT_COMPLAINTS = "/clients/:clientId/complaints",
  ENQUIRIES = "/enquiries",
  ENQUIRY_DETAIL = "/enquiries/:id",
  QUOTATIONS = "/quotations",
  QUOTATION_DETAIL = "/quotations/:id",
  COMPLAINTS = "/complaints",
  COMPLAINT_DETAIL = "/complaints/:id",
  COMPLAINT_SMR_CREATE = "/complaints/:id/smr/create",
  COMPLAINT_SMR_EDIT = "/complaints/:id/smr/edit",
  AMC = "/amc",
  AMC_DETAIL = "/amc/:id",
  AMC_PLANS = "/amc-plans",
  STAFF = "/staff",
  STAFF_DETAIL = "/staff/:id",
  INVOICES = "/invoices",
  REPORTS = "/reports",
}

export enum ApiRoute {
  // Auth Routes
  AUTH_LOGIN = "/auth/login",
  AUTH_LOGOUT = "/auth/logout",
  AUTH_REFRESH = "/auth/refresh",
  // Client Routes
  CLIENTS = "/clients",
  CLIENT_BY_ID = "/clients/:id",
  // Complaints Routes
  COMPLAINTS = "/complaints",
  // SMR Routes
  SMRS = "/smrs",
  STAFF = "/staff",
}

