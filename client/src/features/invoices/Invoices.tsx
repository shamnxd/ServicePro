import { useState } from "react";
import { Plus, Search, Download, Eye, Send, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export const mockInvoices = [
  {
    id: 1,
    invoiceNo: "INV-2026-001",
    date: "2026-05-10",
    clientName: "ABC Corporation",
    amount: 850000,
    gst: 153000,
    totalAmount: 1003000,
    dueDate: "2026-06-10",
    status: "Paid",
    paidDate: "2026-05-25",
    type: "Project",
  },
  {
    id: 2,
    invoiceNo: "INV-2026-002",
    date: "2026-05-12",
    clientName: "XYZ Industries",
    amount: 240000,
    gst: 43200,
    totalAmount: 283200,
    dueDate: "2026-06-12",
    status: "Pending",
    paidDate: null,
    type: "AMC",
  },
  {
    id: 3,
    invoiceNo: "INV-2026-003",
    date: "2026-05-08",
    clientName: "DEF Solutions",
    amount: 125000,
    gst: 22500,
    totalAmount: 147500,
    dueDate: "2026-05-23",
    status: "Overdue",
    paidDate: null,
    type: "Complaint",
  },
  {
    id: 4,
    invoiceNo: "INV-2026-004",
    date: "2026-05-14",
    clientName: "GHI Enterprises",
    amount: 980000,
    gst: 176400,
    totalAmount: 1156400,
    dueDate: "2026-06-14",
    status: "Sent",
    paidDate: null,
    type: "Quotation",
  },
];

export function Invoices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices] = useState(mockInvoices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-500/10 text-green-500";
      case "Sent":
        return "bg-blue-500/10 text-blue-500";
      case "Pending":
        return "bg-amber-500/10 text-amber-500";
      case "Overdue":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="h-4 w-4" />;
      case "Sent":
        return <Send className="h-4 w-4" />;
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "Overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status !== "Paid")
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Invoice Management</h2>
          <p className="text-muted-foreground mt-1">Generate and track invoices</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Generate Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generate New Invoice</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client">Client *</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abc">ABC Corporation</SelectItem>
                      <SelectItem value="xyz">XYZ Industries</SelectItem>
                      <SelectItem value="def">DEF Solutions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="invoiceType">Invoice Type *</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="amc">AMC</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="quotation">Quotation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="invoiceDate">Invoice Date *</Label>
                  <Input id="invoiceDate" type="date" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input id="dueDate" type="date" className="mt-1" />
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-3">Invoice Items</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Label htmlFor="itemDesc">Description</Label>
                      <Input id="itemDesc" placeholder="Item description" className="mt-1" />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="itemQty">Quantity</Label>
                      <Input id="itemQty" type="number" placeholder="0" className="mt-1" />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="itemRate">Rate (₹)</Label>
                      <Input id="itemRate" type="number" placeholder="0.00" className="mt-1" />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="itemTotal">Total</Label>
                      <Input id="itemTotal" type="number" placeholder="0.00" className="mt-1" disabled />
                    </div>
                    <div className="col-span-1">
                      <Button type="button" size="sm" className="w-full">+</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg border border-border">
                <div>
                  <Label htmlFor="subtotal">Subtotal (₹)</Label>
                  <Input id="subtotal" type="number" placeholder="0.00" className="mt-1" disabled />
                </div>
                <div>
                  <Label htmlFor="gst">GST @ 18% (₹)</Label>
                  <Input id="gst" type="number" placeholder="0.00" className="mt-1" disabled />
                </div>
                <div>
                  <Label htmlFor="grandTotal">Grand Total (₹)</Label>
                  <Input id="grandTotal" type="number" placeholder="0.00" className="mt-1" disabled />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button type="submit">Generate & Send</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Sent">Sent</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Invoices</p>
          <p className="text-2xl font-bold text-foreground mt-1">{invoices.length}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">
            ₹{(totalRevenue / 100000).toFixed(2)}L
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Paid Amount</p>
          <p className="text-2xl font-bold text-green-500 mt-1">
            ₹{(paidAmount / 100000).toFixed(2)}L
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Pending Amount</p>
          <p className="text-2xl font-bold text-red-500 mt-1">
            ₹{(pendingAmount / 100000).toFixed(2)}L
          </p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Invoice No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total (incl. GST)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {invoice.invoiceNo}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {invoice.clientName}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-500">
                      {invoice.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    ₹{invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    ₹{invoice.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-500 hover:text-blue-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-500 hover:text-green-600 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      {invoice.status !== "Paid" && (
                        <button className="text-purple-500 hover:text-purple-600 transition-colors">
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
