import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { Dashboard } from "./features/dashboard/Dashboard";
import { Clients } from "./features/clients/Clients";
import { Enquiries } from "./features/enquiries/Enquiries";
import { EnquiryDetail } from "./features/enquiries/EnquiryDetail";
import { Quotations } from "./features/quotations/Quotations";
import { QuotationDetail } from "./features/quotations/QuotationDetail";
import { Complaints } from "./features/complaints/Complaints";
import { ComplaintDetail } from "./features/complaints/ComplaintDetail";
import { AMC } from "./features/amc/AMC";
import { AMCDetail } from "./features/amc/AMCDetail";
import { AMCPlans } from "./features/amc/AMCPlans";
import { Staff } from "./features/staff/Staff";
import { Invoices } from "./features/invoices/Invoices";
import { Reports } from "./features/reports/Reports";
import { Kanban } from "./features/kanban/Kanban";
import { Login } from "./features/auth/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "kanban", element: <Kanban /> },
      { path: "clients", element: <Clients /> },
      { path: "enquiries", element: <Enquiries /> },
      { path: "enquiries/:id", element: <EnquiryDetail /> },
      { path: "quotations", element: <Quotations /> },
      { path: "quotations/:id", element: <QuotationDetail /> },
      { path: "complaints", element: <Complaints /> },
      { path: "complaints/:id", element: <ComplaintDetail /> },
      { path: "amc", element: <AMC /> },
      { path: "amc/:id", element: <AMCDetail /> },
      { path: "amc-plans", element: <AMCPlans /> },
      { path: "staff", element: <Staff /> },
      { path: "invoices", element: <Invoices /> },
      { path: "reports", element: <Reports /> },
    ],
  },
]);

