import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Search, Calendar, CheckCircle, Clock, AlertTriangle, User, Building } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";

export const mockAMCContracts = [
  {
    id: 1,
    amcNo: "AMC-2026-001",
    clientName: "ABC Corporation",
    contactPerson: "John Doe",
    phone: "+91 98765 43210",
    email: "john@abccorp.com",
    location: "Mumbai - Main Office",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    frequency: "Quarterly",
    nextVisit: "2026-06-01",
    status: "Active",
    amount: 120000,
    visitsCompleted: 2,
    totalVisits: 4,
    serviceType: "HVAC Maintenance",
    planName: "Premium Plan",
    serviceLogs: [
      {
        id: 1,
        date: "2026-01-15",
        travelTime: 45,
        workTime: 180,
        petrolExpense: 600,
        otherExpenses: 0,
        materials: [
          { name: "Filter Replacement", quantity: 4, cost: 2000 },
          { name: "Refrigerant Top-up", quantity: 1, cost: 1500 },
        ],
        remarks: "Regular quarterly maintenance completed. All units working optimally.",
        technician: "Rajesh Kumar",
      },
      {
        id: 2,
        date: "2026-04-10",
        travelTime: 50,
        workTime: 150,
        petrolExpense: 600,
        otherExpenses: 200,
        materials: [
          { name: "Filter Replacement", quantity: 4, cost: 2000 },
        ],
        remarks: "Second quarter maintenance. Minor cleaning required.",
        technician: "Rajesh Kumar",
      },
    ],
    remarks: [
      { user: "Admin", date: "2026-01-01", text: "Contract activated. Premium HVAC maintenance plan." },
      { user: "Rajesh Kumar", date: "2026-01-15", text: "First visit completed successfully." },
    ],
  },
  {
    id: 2,
    amcNo: "AMC-2026-002",
    clientName: "XYZ Industries",
    contactPerson: "Jane Smith",
    phone: "+91 98765 43211",
    email: "jane@xyzind.com",
    location: "Delhi - Factory Unit",
    startDate: "2026-03-01",
    endDate: "2027-02-28",
    frequency: "Monthly",
    nextVisit: "2026-05-20",
    status: "Active",
    amount: 240000,
    visitsCompleted: 3,
    totalVisits: 12,
    serviceType: "Fire Safety System",
    planName: "Enterprise Plan",
    serviceLogs: [],
    remarks: [],
  },
  {
    id: 3,
    amcNo: "AMC-2025-045",
    clientName: "DEF Solutions",
    contactPerson: "Mike Johnson",
    phone: "+91 98765 43212",
    email: "mike@defsol.com",
    location: "Bangalore - IT Park",
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    frequency: "Quarterly",
    nextVisit: null,
    status: "Due for Renewal",
    amount: 150000,
    visitsCompleted: 4,
    totalVisits: 4,
    serviceType: "Electrical Panel Maintenance",
    planName: "Standard Plan",
    serviceLogs: [],
    remarks: [
      { user: "Admin", date: "2026-05-10", text: "Contract expiring soon. Send renewal reminder." },
    ],
  },
  {
    id: 4,
    amcNo: "AMC-2025-038",
    clientName: "GHI Enterprises",
    contactPerson: "Sarah Williams",
    phone: "+91 98765 43213",
    email: "sarah@ghient.com",
    location: "Pune - Warehouse",
    startDate: "2025-04-01",
    endDate: "2026-03-31",
    frequency: "Bi-Annual",
    nextVisit: null,
    status: "Expired",
    amount: 80000,
    visitsCompleted: 2,
    totalVisits: 2,
    serviceType: "Generator Maintenance",
    planName: "Basic Plan",
    serviceLogs: [],
    remarks: [
      { user: "Admin", date: "2026-04-01", text: "Contract expired. Follow up for renewal." },
    ],
  },
];

export const mockScheduledVisits = [
  {
    id: 1,
    amcNo: "AMC-2026-001",
    clientName: "ABC Corporation",
    scheduledDate: "2026-06-01",
    assignedTo: "Rajesh Kumar",
    status: "Scheduled",
    visitType: "Preventive Maintenance",
  },
  {
    id: 2,
    amcNo: "AMC-2026-002",
    clientName: "XYZ Industries",
    scheduledDate: "2026-05-20",
    assignedTo: "Amit Sharma",
    status: "Scheduled",
    visitType: "Routine Inspection",
  },
  {
    id: 3,
    amcNo: "AMC-2026-003",
    clientName: "JKL Solutions",
    scheduledDate: "2026-05-18",
    assignedTo: "Priya Patel",
    status: "Completed",
    visitType: "Quarterly Service",
  },
];

export function AMC() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [contracts] = useState(mockAMCContracts);
  const [visits] = useState(mockScheduledVisits);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isScheduleVisitDialogOpen, setIsScheduleVisitDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.amcNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-500";
      case "Due for Renewal":
        return "bg-amber-500/10 text-amber-500";
      case "Expired":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4" />;
      case "Due for Renewal":
        return <AlertTriangle className="h-4 w-4" />;
      case "Expired":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AMC Management</h2>
          <p className="text-muted-foreground mt-1">Manage annual maintenance contracts</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add AMC Contract
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New AMC Contract</DialogTitle>
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
                  <Label htmlFor="frequency">Visit Frequency *</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="biannual">Bi-Annual</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input id="startDate" type="date" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input id="endDate" type="date" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="amount">Contract Amount (₹) *</Label>
                  <Input id="amount" type="number" placeholder="0.00" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="totalVisits">Total Visits *</Label>
                  <Input id="totalVisits" type="number" placeholder="4" className="mt-1" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create AMC Contract</Button>
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
              placeholder="Search AMC contracts..."
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
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Due for Renewal">Due for Renewal</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Total AMC Contracts</p>
          <p className="text-2xl font-bold text-foreground mt-1">{contracts.length}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Active Contracts</p>
          <p className="text-2xl font-bold text-green-500 mt-1">
            {contracts.filter((c) => c.status === "Active").length}
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Due for Renewal</p>
          <p className="text-2xl font-bold text-amber-500 mt-1">
            {contracts.filter((c) => c.status === "Due for Renewal").length}
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Total AMC Revenue</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">
            ₹{(contracts.reduce((sum, c) => sum + c.amount, 0) / 100000).toFixed(1)}L
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="contracts">AMC Contracts</TabsTrigger>
          <TabsTrigger value="visits">Scheduled Visits</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredContracts.map((contract) => (
              <div key={contract.id} className="bg-card rounded-lg shadow-sm hover:shadow transition-shadow border border-border">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{contract.amcNo}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(contract.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(contract.status)}`}>
                      {getStatusIcon(contract.status)}
                      {contract.status}
                    </span>
                  </div>

                  <div className="space-y-2.5 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-muted overflow-hidden shrink-0 border border-border">
                        <img
                          src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(contract.clientName)}&backgroundColor=be185d&fontSize=40&fontWeight=700`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-foreground truncate">{contract.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      <span className="truncate">{contract.serviceType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0" />
                      <span>{contract.frequency}</span>
                    </div>
                    {contract.nextVisit && (
                      <div className="flex items-center gap-2 text-xs text-blue-500 font-medium">
                        <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>Next: {new Date(contract.nextVisit).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="pt-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span className="font-medium text-foreground">{contract.visitsCompleted}/{contract.totalVisits}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all"
                          style={{
                            width: `${(contract.visitsCompleted / contract.totalVisits) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
                      <span className="text-muted-foreground">Value</span>
                      <span className="font-bold text-foreground">₹{contract.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-border/50">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => navigate(`/amc/${contract.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => {
                        setSelectedContract(contract);
                        setIsScheduleVisitDialogOpen(true);
                      }}
                    >
                      Schedule
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="visits" className="mt-6">
          <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      AMC No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Visit Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Scheduled Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Assigned To
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
                  {visits.map((visit) => (
                    <tr key={visit.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{visit.amcNo}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{visit.clientName}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{visit.visitType}</td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {new Date(visit.scheduledDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{visit.assignedTo}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${visit.status === "Completed"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-blue-500/10 text-blue-500"
                            }`}
                        >
                          {visit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button size="sm" variant="outline">
                          {visit.status === "Completed" ? "View Report" : "Complete Visit"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>


      {/* Schedule Visit Dialog */}
      <Dialog open={isScheduleVisitDialogOpen} onOpenChange={setIsScheduleVisitDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule AMC Visit</DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <form className="space-y-4 mt-4">
              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-500 font-medium">
                  <strong>AMC Contract:</strong> {selectedContract.amcNo} - {selectedContract.clientName}
                </p>
                <p className="text-xs text-blue-500/70 mt-1 font-medium">
                  Service Type: {selectedContract.serviceType} | Frequency: {selectedContract.frequency}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="visitDate">Visit Date *</Label>
                  <Input
                    id="visitDate"
                    type="date"
                    className="mt-1"
                    defaultValue={selectedContract.nextVisit || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="visitTime">Visit Time *</Label>
                  <Input id="visitTime" type="time" className="mt-1" defaultValue="10:00" />
                </div>
                <div>
                  <Label htmlFor="visitType">Visit Type *</Label>
                  <Select defaultValue="preventive">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preventive">Preventive Maintenance</SelectItem>
                      <SelectItem value="inspection">Routine Inspection</SelectItem>
                      <SelectItem value="service">Quarterly Service</SelectItem>
                      <SelectItem value="emergency">Emergency Visit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignTechnician">Assign Technician *</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rajesh">Rajesh Kumar</SelectItem>
                      <SelectItem value="amit">Amit Sharma</SelectItem>
                      <SelectItem value="priya">Priya Patel</SelectItem>
                      <SelectItem value="vikram">Vikram Singh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="visitNotes">Visit Notes</Label>
                  <Textarea
                    id="visitNotes"
                    placeholder="Add any special instructions or notes for this visit..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsScheduleVisitDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Schedule Visit</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
