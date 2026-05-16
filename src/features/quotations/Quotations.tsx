import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Search, FileText, Download, Eye, CheckCircle, Clock, MessageSquare } from "lucide-react";
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
import { Textarea } from "../../components/ui/textarea";

const mockQuotations = [
  {
    id: 1,
    quotationNo: "QUO-2026-001",
    date: "2026-05-12",
    clientName: "ABC Corporation",
    enquiryNo: "ENQ-2026-001",
    amount: 850000,
    gst: 153000,
    total: 1003000,
    status: "Pending Approval",
    validUntil: "2026-06-12",
    items: [
      { description: "HVAC Unit Installation", qty: 2, rate: 300000, total: 600000 },
      { description: "Ducting Work", qty: 1, rate: 150000, total: 150000 },
      { description: "Electrical Wiring", qty: 1, rate: 100000, total: 100000 },
    ],
    remarks: [
      { user: "Admin", date: "2026-05-12", text: "Quotation sent to client" },
    ],
  },
  {
    id: 2,
    quotationNo: "QUO-2026-002",
    date: "2026-05-14",
    clientName: "XYZ Industries",
    enquiryNo: "ENQ-2026-002",
    amount: 1250000,
    gst: 225000,
    total: 1475000,
    status: "Approved",
    validUntil: "2026-06-14",
    items: [
      { description: "Fire Alarm System", qty: 5, rate: 250000, total: 1250000 },
    ],
    remarks: [
      { user: "Admin", date: "2026-05-14", text: "Quotation created" },
      { user: "Client", date: "2026-05-15", text: "Approved. Please proceed" },
    ],
  },
  {
    id: 3,
    quotationNo: "QUO-2026-003",
    date: "2026-05-15",
    clientName: "DEF Solutions",
    enquiryNo: "ENQ-2026-003",
    amount: 650000,
    gst: 117000,
    total: 767000,
    status: "Pending Approval",
    validUntil: "2026-06-15",
    items: [
      { description: "Electrical Panel Upgrade", qty: 3, rate: 150000, total: 450000 },
      { description: "Circuit Breakers", qty: 10, rate: 20000, total: 200000 },
    ],
    remarks: [],
  },
  {
    id: 4,
    quotationNo: "QUO-2026-004",
    date: "2026-05-10",
    clientName: "GHI Enterprises",
    enquiryNo: "ENQ-2026-004",
    amount: 980000,
    gst: 176400,
    total: 1156400,
    status: "Rejected",
    validUntil: "2026-06-10",
    items: [
      { description: "Generator 500KVA", qty: 1, rate: 800000, total: 800000 },
      { description: "Installation & Testing", qty: 1, rate: 180000, total: 180000 },
    ],
    remarks: [
      { user: "Client", date: "2026-05-11", text: "Price too high, looking for alternatives" },
    ],
  },
];

export function Quotations() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [quotations] = useState(mockQuotations);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [newRemark, setNewRemark] = useState("");

  const filteredQuotations = quotations.filter((quotation) => {
    const matchesSearch =
      quotation.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quotation.quotationNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || quotation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending Approval":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4" />;
      case "Pending Approval":
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quotation Management</h2>
          <p className="text-gray-600 mt-1">Create and track quotations</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Quotation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Quotation</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="enquiry">Enquiry *</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select enquiry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enq1">ENQ-2026-001 - ABC Corporation</SelectItem>
                      <SelectItem value="enq2">ENQ-2026-002 - XYZ Industries</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quotationDate">Quotation Date *</Label>
                  <Input id="quotationDate" type="date" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="validUntil">Valid Until *</Label>
                  <Input id="validUntil" type="date" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input id="amount" type="number" placeholder="0.00" className="mt-1" />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Line Items</h4>
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
                      <Label htmlFor="itemRate">Rate</Label>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gst">GST (%)</Label>
                  <Input id="gst" type="number" placeholder="18" className="mt-1" />
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
                <Button type="submit">Generate Quotation</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search quotations..."
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
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Pending Approval">Pending Approval</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Quotations</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{quotations.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {quotations.filter((q) => q.status === "Approved").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {quotations.filter((q) => q.status === "Pending Approval").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Value</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            ₹{(quotations.reduce((sum, q) => sum + q.amount, 0) / 100000).toFixed(1)}L
          </p>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quotation No</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Enquiry No</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Valid Until</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQuotations.map((quotation) => (
                <tr key={quotation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-900 text-sm">
                    {quotation.quotationNo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(quotation.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {quotation.clientName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {quotation.enquiryNo}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ₹{quotation.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(quotation.validUntil).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quotation.status)}`}>
                      {getStatusIcon(quotation.status)}
                      {quotation.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/quotations/${quotation.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Download className="h-4 w-4" />
                      </button>
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
