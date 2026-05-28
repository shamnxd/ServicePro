import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { Dashboard } from "./features/dashboard/Dashboard";
import { Clients } from "./features/clients/Clients";
import { ClientDetail } from "./features/clients/ClientDetail";
import { Enquiries } from "./features/enquiries/Enquiries";
import { EnquiryDetail } from "./features/enquiries/EnquiryDetail";
import { Quotations } from "./features/quotations/Quotations";
import { QuotationDetail } from "./features/quotations/QuotationDetail";
import { QuotationFormPage } from "./features/quotations/QuotationFormPage";
import { Complaints } from "./features/complaints/Complaints";
import { ComplaintDetail } from "./features/complaints/ComplaintDetail";
import { SMRCreatePage } from "./features/complaints/SMRCreatePage";
import { ClientComplaints } from "./features/complaints/ClientComplaints";
import { AMC } from "./features/amc/AMC";
import { AMCDetail } from "./features/amc/AMCDetail";
import { AmcSMRCreatePage } from "./features/amc/AmcSMRCreatePage";
import { AmcVisitDetailPage } from "./features/amc/AmcVisitDetailPage";
import { Staff } from "./features/staff/Staff";
import { StaffDetail } from "./features/staff/StaffDetail";
import { Invoices } from "./features/invoices/Invoices";
import { Reports } from "./features/reports/Reports";
import { Kanban } from "./features/kanban/Kanban";
import { Login } from "./features/auth/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppRoute } from "./constants/routes.enum";

export const router = createBrowserRouter([
  {
    path: AppRoute.LOGIN,
    element: <Login />,
  },
  {
    path: AppRoute.DASHBOARD,
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: AppRoute.KANBAN, element: <Kanban /> },
      { path: AppRoute.CLIENTS, element: <Clients /> },
      { path: AppRoute.CLIENT_DETAIL, element: <ClientDetail /> },
      { path: AppRoute.CLIENT_COMPLAINTS, element: <ClientComplaints /> },
      { path: AppRoute.ENQUIRIES, element: <Enquiries /> },
      { path: AppRoute.ENQUIRY_DETAIL, element: <EnquiryDetail /> },
      { path: AppRoute.QUOTATIONS, element: <Quotations /> },
      { path: AppRoute.QUOTATION_CREATE, element: <QuotationFormPage /> },
      { path: AppRoute.QUOTATION_EDIT, element: <QuotationFormPage /> },
      { path: AppRoute.QUOTATION_DETAIL, element: <QuotationDetail /> },
      { path: AppRoute.COMPLAINTS, element: <Complaints /> },
      { path: AppRoute.COMPLAINT_DETAIL, element: <ComplaintDetail /> },
      { path: AppRoute.COMPLAINT_SMR_CREATE, element: <SMRCreatePage mode="create" /> },
      { path: AppRoute.COMPLAINT_SMR_EDIT, element: <SMRCreatePage mode="edit" /> },
      { path: AppRoute.AMC, element: <AMC /> },
      { path: AppRoute.AMC_DETAIL, element: <AMCDetail /> },
      { path: AppRoute.AMC_VISIT_DETAIL, element: <AmcVisitDetailPage /> },
      { path: AppRoute.AMC_VISIT_SMR_CREATE, element: <AmcSMRCreatePage /> },
      { path: AppRoute.STAFF, element: <Staff /> },
      { path: AppRoute.STAFF_DETAIL, element: <StaffDetail /> },
      { path: AppRoute.INVOICES, element: <Invoices /> },
      { path: AppRoute.REPORTS, element: <Reports /> },
    ],
  },
]);
