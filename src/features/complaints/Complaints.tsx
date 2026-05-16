import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Search, AlertCircle, User, Calendar, MapPin, MessageSquare } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ServiceTracking } from "../../components/ServiceTracking";

const mockComplaints = [
  {
    id: 1,
    complaintNo: "CMP-2026-001",
    date: "2026-05-14",
    clientName: "ABC Corporation",
    contactPerson: "John Doe",
    phone: "+91 98765 43210",
    issue: "AC not cooling properly",
    description: "Central AC unit in main building not providing adequate cooling. Temperature not dropping below 26°C.",
    priority: "High",
    status: "In Progress",
    assignedTo: "Rajesh Kumar",
    location: "Mumbai - Main Office Building",
    expectedResolution: "2026-05-17",
    serviceLogs: [
      {
        id: 1,
        date: "2026-05-14",
        travelTime: 45,
        workTime: 120,
        petrolExpense: 500,
        otherExpenses: 0,
        materials: [
          { name: "Refrigerant Gas R410A", quantity: 2, cost: 3000 },
          { name: "Filter", quantity: 1, cost: 500 },
        ],
        remarks: "Checked refrigerant levels, refilled gas, replaced filter",
        technician: "Rajesh Kumar",
      },
    ],
    remarks: [
      { user: "Rajesh Kumar", date: "2026-05-14", text: "Arrived on site. Inspection in progress." },
      { user: "Rajesh Kumar", date: "2026-05-14", text: "Low refrigerant detected. Refilling now." },
    ],
  },
  {
    id: 2,
    complaintNo: "CMP-2026-002",
    date: "2026-05-15",
    clientName: "XYZ Industries",
    contactPerson: "Jane Smith",
    phone: "+91 98765 43211",
    issue: "Fire alarm system malfunction",
    description: "Fire alarm sensors triggering false alarms in Zone B repeatedly.",
    priority: "Critical",
    status: "Pending",
    assignedTo: "Amit Sharma",
    location: "Delhi - Factory Unit 2",
    expectedResolution: "2026-05-16",
    serviceLogs: [],
    remarks: [
      { user: "Admin", date: "2026-05-15", text: "Critical issue. Assigned to Amit immediately." },
    ],
  },
  {
    id: 3,
    complaintNo: "CMP-2026-003",
    date: "2026-05-13",
    clientName: "DEF Solutions",
    contactPerson: "Mike Johnson",
    phone: "+91 98765 43212",
    issue: "Electrical panel maintenance",
    description: "Routine maintenance required for electrical distribution panel",
    priority: "Medium",
    status: "Resolved",
    assignedTo: "Priya Patel",
    location: "Bangalore - IT Park",
    expectedResolution: "2026-05-15",
    serviceLogs: [
      {
        id: 1,
        date: "2026-05-14",
        travelTime: 60,
        workTime: 180,
        petrolExpense: 800,
        otherExpenses: 200,
        materials: [
          { name: "MCB 32A", quantity: 3, cost: 1200 },
          { name: "Cable Lugs", quantity: 10, cost: 500 },
        ],
        remarks: "Panel cleaned, MCBs replaced, connections tightened",
        technician: "Priya Patel",
      },
    ],
    remarks: [
      { user: "Priya Patel", date: "2026-05-14", text: "Work completed successfully. Panel tested OK." },
      { user: "Client", date: "2026-05-15", text: "Thank you. Everything working perfectly." },
    ],
  },
  {
    id: 4,
    complaintNo: "CMP-2026-004",
    date: "2026-05-16",
    clientName: "GHI Enterprises",
    contactPerson: "Sarah Williams",
    phone: "+91 98765 43213",
    issue: "Generator not starting",
    description: "Backup generator fails to start. Battery indicator showing low.",
    priority: "High",
    status: "In Progress",
    assignedTo: "Vikram Singh",
    location: "Pune - Warehouse Complex",
    expectedResolution: "2026-05-18",
    serviceLogs: [
      {
        id: 1,
        date: "2026-05-16",
        travelTime: 90,
        workTime: 60,
        petrolExpense: 1200,
        otherExpenses: 0,
        materials: [],
        remarks: "Initial inspection. Battery needs replacement.",
        technician: "Vikram Singh",
      },
    ],
    remarks: [
      { user: "Vikram Singh", date: "2026-05-16", text: "Battery dead. Ordering replacement." },
    ],
  },
];

export function Complaints() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [complaints] = useState(mockComplaints);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [newRemark, setNewRemark] = useState("");

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.complaintNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.issue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-600 text-white";
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Complaint Management</h2>
          <p className="text-gray-600 mt-1">Track and resolve customer complaints</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Register Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Complaint</DialogTitle>
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
                  <Label htmlFor="complaintDate">Complaint Date *</Label>
                  <Input id="complaintDate" type="date" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="priority">Priority *</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input id="location" placeholder="City/Area" className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="issue">Issue Description *</Label>
                  <Textarea
                    id="issue"
                    placeholder="Describe the issue"
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="assignTo">Assign To *</Label>
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
                <div>
                  <Label htmlFor="expectedResolution">Expected Resolution *</Label>
                  <Input id="expectedResolution" type="date" className="mt-1" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Register Complaint</Button>
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
              placeholder="Search complaints..."
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
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Complaints</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{complaints.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {complaints.filter((c) => c.status === "Pending").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {complaints.filter((c) => c.status === "In Progress").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Resolved</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {complaints.filter((c) => c.status === "Resolved").length}
          </p>
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredComplaints.map((complaint) => (
          <div
            key={complaint.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border-l-4"
            style={{
              borderLeftColor:
                complaint.priority === "Critical"
                  ? "#dc2626"
                  : complaint.priority === "High"
                    ? "#f59e0b"
                    : complaint.priority === "Medium"
                      ? "#eab308"
                      : "#22c55e",
            }}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{complaint.complaintNo}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(complaint.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                  {complaint.priority}
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>

              <div className="space-y-2.5 mb-4">
                <div className="flex items-start gap-2 text-sm font-medium text-gray-900">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{complaint.issue}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-5 w-5 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                    <img
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(complaint.clientName)}&backgroundColor=be185d&fontSize=40&fontWeight=700`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="truncate">{complaint.clientName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{complaint.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="h-4 w-4 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                    <img
                      src={`https://i.pravatar.cc/150?u=${encodeURIComponent(complaint.assignedTo)}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="truncate">{complaint.assignedTo}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  <span>{new Date(complaint.expectedResolution).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => navigate(`/complaints/${complaint.id}`)}
                >
                  View
                </Button>
                {complaint.status !== "Resolved" && (
                  <Button size="sm" className="flex-1 text-xs">
                    Update
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}
