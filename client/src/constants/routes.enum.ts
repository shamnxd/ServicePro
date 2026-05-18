export enum AppRoute {
  LOGIN = "/login",
  DASHBOARD = "/",
  KANBAN = "/kanban",
  CLIENTS = "/clients",
  ENQUIRIES = "/enquiries",
  ENQUIRY_DETAIL = "/enquiries/:id",
  QUOTATIONS = "/quotations",
  QUOTATION_DETAIL = "/quotations/:id",
  COMPLAINTS = "/complaints",
  COMPLAINT_DETAIL = "/complaints/:id",
  AMC = "/amc",
  AMC_DETAIL = "/amc/:id",
  AMC_PLANS = "/amc-plans",
  STAFF = "/staff",
  INVOICES = "/invoices",
  REPORTS = "/reports",
}

export enum ApiRoute {
  // Auth Routes
  AUTH_LOGIN = "/auth/login",
  AUTH_LOGOUT = "/auth/logout",
  AUTH_REFRESH = "/auth/refresh",
}
