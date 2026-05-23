import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Search,
  Calendar,
  User,
  Building,
  CheckCircle,
  Upload,
  FileText,
  Download,
} from "lucide-react";
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

export const mockEnquiries = [
  {
    id: 1,
    enquiryNo: "ENQ-2026-001",
    date: "2026-05-10",
    clientName: "ABC Corporation",
    contactPerson: "John Doe",
    phone: "+91 98765 43210",
    email: "john@abccorp.com",
    requirement: "HVAC System Installation",
    description:
      "Need complete HVAC system for 50,000 sq ft office building with 5 floors",
    status: "Site Visit Scheduled",
    priority: "High",
    assignedTo: "Rajesh Kumar",
    followUpDate: "2026-05-20",
    drawings: [
      {
        name: "Floor_Plan.pdf",
        uploadDate: "2026-05-11",
        uploadedBy: "Client",
      },
      {
        name: "HVAC_Layout.dwg",
        uploadDate: "2026-05-12",
        uploadedBy: "Rajesh Kumar",
      },
    ],
  },
  {
    id: 2,
    enquiryNo: "ENQ-2026-002",
    date: "2026-05-12",
    clientName: "XYZ Industries",
    contactPerson: "Jane Smith",
    phone: "+91 98765 43211",
    email: "jane@xyzind.com",
    requirement: "Fire Safety System",
    description:
      "Fire alarm and sprinkler system for factory premises",
    status: "Quotation Prepared",
    priority: "Medium",
    assignedTo: "Amit Sharma",
    followUpDate: "2026-05-18",
    drawings: [
      {
        name: "Factory_Layout.pdf",
        uploadDate: "2026-05-13",
        uploadedBy: "Client",
      },
    ],
  },
  {
    id: 3,
    enquiryNo: "ENQ-2026-003",
    date: "2026-05-14",
    clientName: "DEF Solutions",
    contactPerson: "Mike Johnson",
    phone: "+91 98765 43212",
    email: "mike@defsol.com",
    requirement: "Electrical Panel Upgrade",
    description:
      "Upgrade main electrical distribution panel and sub-panels",
    status: "Follow-up Required",
    priority: "Low",
    assignedTo: "Priya Patel",
    followUpDate: "2026-05-22",
    drawings: [],
  },
  {
    id: 4,
    enquiryNo: "ENQ-2026-004",
    date: "2026-05-15",
    clientName: "GHI Enterprises",
    contactPerson: "Sarah Williams",
    phone: "+91 98765 43213",
    email: "sarah@ghient.com",
    requirement: "Generator Installation",
    description:
      "500 KVA diesel generator with automatic transfer switch",
    status: "Converted to Project",
    priority: "High",
    assignedTo: "Vikram Singh",
    followUpDate: null,
    drawings: [
      {
        name: "Generator_Location.pdf",
        uploadDate: "2026-05-15",
        uploadedBy: "Client",
      },
      {
        name: "Electrical_SLD.pdf",
        uploadDate: "2026-05-15",
        uploadedBy: "Vikram Singh",
      },
    ],
  },
];

export function Enquiries() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [enquiries] = useState(mockEnquiries);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isQuotationDialogOpen, setIsQuotationDialogOpen] =
    useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.clientName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      enquiry.enquiryNo
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      enquiry.requirement
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || enquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Site Visit Scheduled":
        return "bg-blue-500/10 text-blue-500";
      case "Quotation Prepared":
        return "bg-amber-500/10 text-amber-500";
      case "Follow-up Required":
        return "bg-orange-500/10 text-orange-500";
      case "Converted to Project":
        return "bg-green-500/10 text-green-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-500";
      case "Medium":
        return "bg-amber-500/10 text-amber-500";
      case "Low":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Enquiry Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Track and manage customer enquiries
          </p>
        </div>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Enquiry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Enquiry</DialogTitle>
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
                      <SelectItem value="abc">
                        ABC Corporation
                      </SelectItem>
                      <SelectItem value="xyz">
                        XYZ Industries
                      </SelectItem>
                      <SelectItem value="def">
                        DEF Solutions
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contactPerson">
                    Contact Person *
                  </Label>
                  <Input
                    id="contactPerson"
                    placeholder="Contact person"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="enquiryDate">
                    Enquiry Date *
                  </Label>
                  <Input
                    id="enquiryDate"
                    type="date"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority *</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">
                        Medium
                      </SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="requirement">
                    Requirement *
                  </Label>
                  <Textarea
                    id="requirement"
                    placeholder="Describe the requirement"
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="assignTo">Assign To *</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select engineer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rajesh">
                        Rajesh Kumar
                      </SelectItem>
                      <SelectItem value="amit">
                        Amit Sharma
                      </SelectItem>
                      <SelectItem value="priya">
                        Priya Patel
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="followUpDate">
                    Follow-up Date
                  </Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Enquiry</Button>
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
              placeholder="Search enquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Site Visit Scheduled">
                Site Visit Scheduled
              </SelectItem>
              <SelectItem value="Quotation Prepared">
                Quotation Prepared
              </SelectItem>
              <SelectItem value="Follow-up Required">
                Follow-up Required
              </SelectItem>
              <SelectItem value="Converted to Project">
                Converted to Project
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">
            Total Enquiries
          </p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {enquiries.length}
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Site Visits</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">
            {
              enquiries.filter(
                (e) => e.status === "Site Visit Scheduled",
              ).length
            }
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">
            Quotations Prepared
          </p>
          <p className="text-2xl font-bold text-amber-500 mt-1">
            {
              enquiries.filter(
                (e) => e.status === "Quotation Prepared",
              ).length
            }
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Converted</p>
          <p className="text-2xl font-bold text-green-500 mt-1">
            {
              enquiries.filter(
                (e) => e.status === "Converted to Project",
              ).length
            }
          </p>
        </div>
      </div>

      {/* Enquiries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredEnquiries.map((enquiry) => (
          <div
            key={enquiry.id}
            className="bg-card rounded-lg shadow-sm hover:shadow transition-shadow border border-border"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {enquiry.enquiryNo}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(
                      enquiry.date,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(enquiry.priority)}`}
                >
                  {enquiry.priority}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(enquiry.status)}`}
                >
                  {enquiry.status}
                </span>
              </div>

              <div className="space-y-2.5 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-muted overflow-hidden shrink-0 border border-border">
                    <img
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(enquiry.clientName)}&backgroundColor=be185d&fontSize=40&fontWeight=700`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-foreground truncate">
                    {enquiry.clientName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-5 w-5 rounded-full bg-muted overflow-hidden shrink-0 border border-border">
                    <img
                      src={`https://i.pravatar.cc/150?u=${encodeURIComponent(enquiry.contactPerson)}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="truncate">
                    {enquiry.contactPerson}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    {enquiry.requirement}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-4 w-4 rounded-full overflow-hidden shrink-0 border border-border/50">
                    <img 
                      src={`https://i.pravatar.cc/150?u=${encodeURIComponent(enquiry.assignedTo)}`} 
                      alt={enquiry.assignedTo} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="truncate">
                    {enquiry.assignedTo}
                  </span>
                </div>
                {enquiry.followUpDate && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0" />
                    <span>
                      {new Date(
                        enquiry.followUpDate,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-border/50">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => navigate(`/enquiries/${enquiry.id}`)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => {
                    setSelectedEnquiry(enquiry);
                    setIsQuotationDialogOpen(true);
                  }}
                >
                  Quotation
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>



      {/* Create Quotation Dialog */}
      <Dialog
        open={isQuotationDialogOpen}
        onOpenChange={setIsQuotationDialogOpen}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Quotation</DialogTitle>
          </DialogHeader>
          {selectedEnquiry && (
            <form className="space-y-4 mt-4">
              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-500 font-medium">
                  <strong>Enquiry:</strong>{" "}
                  {selectedEnquiry.enquiryNo} -{" "}
                  {selectedEnquiry.clientName}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quotationDate">
                    Quotation Date *
                  </Label>
                  <Input
                    id="quotationDate"
                    type="date"
                    className="mt-1"
                    defaultValue={
                      new Date().toISOString().split("T")[0]
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="validUntil">
                    Valid Until *
                  </Label>
                  <Input
                    id="validUntil"
                    type="date"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-3">
                  Line Items
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Label htmlFor="itemDesc">
                        Description
                      </Label>
                      <Input
                        id="itemDesc"
                        placeholder="Item description"
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="itemQty">Quantity</Label>
                      <Input
                        id="itemQty"
                        type="number"
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="itemRate">Rate (₹)</Label>
                      <Input
                        id="itemRate"
                        type="number"
                        placeholder="0.00"
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="itemTotal">Total</Label>
                      <Input
                        id="itemTotal"
                        type="number"
                        placeholder="0.00"
                        className="mt-1"
                        disabled
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        size="sm"
                        className="w-full"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border border-border">
                <div>
                  <Label htmlFor="gst">GST (%)</Label>
                  <Input
                    id="gst"
                    type="number"
                    placeholder="18"
                    className="mt-1"
                    defaultValue="18"
                  />
                </div>
                <div>
                  <Label htmlFor="grandTotal">
                    Grand Total (₹)
                  </Label>
                  <Input
                    id="grandTotal"
                    type="number"
                    placeholder="0.00"
                    className="mt-1"
                    disabled
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setIsQuotationDialogOpen(false)
                  }
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Generate Quotation
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
