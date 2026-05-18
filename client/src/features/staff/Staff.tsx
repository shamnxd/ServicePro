import { useState } from "react";
import { Plus, Search, User, Phone, Mail, MapPin, Briefcase, CheckCircle } from "lucide-react";
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

const mockStaff = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Senior Technician",
    phone: "+91 98765 12345",
    email: "rajesh@continental.com",
    location: "Mumbai",
    status: "Available",
    tasksAssigned: 3,
    tasksCompleted: 45,
    specialization: "HVAC Systems",
  },
  {
    id: 2,
    name: "Amit Sharma",
    role: "Technician",
    phone: "+91 98765 12346",
    email: "amit@continental.com",
    location: "Delhi",
    status: "On Site",
    tasksAssigned: 5,
    tasksCompleted: 38,
    specialization: "Fire Safety",
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Junior Technician",
    phone: "+91 98765 12347",
    email: "priya@continental.com",
    location: "Bangalore",
    status: "Available",
    tasksAssigned: 2,
    tasksCompleted: 28,
    specialization: "Electrical Systems",
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Senior Technician",
    phone: "+91 98765 12348",
    email: "vikram@continental.com",
    location: "Pune",
    status: "On Leave",
    tasksAssigned: 0,
    tasksCompleted: 52,
    specialization: "Generator & Power",
  },
];

const mockTasks = [
  {
    id: 1,
    taskNo: "TSK-001",
    staffName: "Rajesh Kumar",
    clientName: "ABC Corporation",
    taskType: "AMC Visit",
    date: "2026-05-18",
    status: "In Progress",
  },
  {
    id: 2,
    taskNo: "TSK-002",
    staffName: "Amit Sharma",
    clientName: "XYZ Industries",
    taskType: "Complaint Resolution",
    date: "2026-05-17",
    status: "Completed",
  },
  {
    id: 3,
    taskNo: "TSK-003",
    staffName: "Priya Patel",
    clientName: "DEF Solutions",
    taskType: "Installation",
    date: "2026-05-19",
    status: "Scheduled",
  },
];

export function Staff() {
  const [searchQuery, setSearchQuery] = useState("");
  const [staff] = useState(mockStaff);
  const [tasks] = useState(mockTasks);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredStaff = staff.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500/10 text-green-500";
      case "On Site":
        return "bg-blue-500/10 text-blue-500";
      case "On Leave":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Staff & Technician Management</h2>
          <p className="text-muted-foreground mt-1">Manage your team and track their tasks</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" placeholder="Enter full name" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="senior">Senior Technician</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="junior">Junior Technician</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" placeholder="+91 XXXXX XXXXX" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="email@continental.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="location">Base Location *</Label>
                  <Input id="location" placeholder="City" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Input id="specialization" placeholder="e.g., HVAC Systems" className="mt-1" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Staff Member</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search staff by name, role, or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Staff</p>
          <p className="text-2xl font-bold text-foreground mt-1">{staff.length}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Available</p>
          <p className="text-2xl font-bold text-green-500 mt-1">
            {staff.filter((s) => s.status === "Available").length}
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">On Site</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">
            {staff.filter((s) => s.status === "On Site").length}
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Active Tasks</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">
            {staff.reduce((sum, s) => sum + s.tasksAssigned, 0)}
          </p>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredStaff.map((member) => (
          <div key={member.id} className="bg-card rounded-lg shadow-sm hover:shadow transition-shadow border border-border">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden shrink-0 ring-2 ring-muted shadow-sm">
                    <img 
                      src={`https://i.pravatar.cc/150?u=${encodeURIComponent(member.name)}`} 
                      alt={member.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                  {member.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4 text-muted-foreground/50" />
                  {member.specialization}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-muted-foreground/50" />
                  {member.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-muted-foreground/50" />
                  {member.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-muted-foreground/50" />
                  {member.location}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground">Active Tasks</p>
                  <p className="text-lg font-bold text-blue-500">{member.tasksAssigned}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-lg font-bold text-green-500">{member.tasksCompleted}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  View Profile
                </Button>
                <Button size="sm" className="flex-1">
                  Assign Task
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tasks */}
      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Recent Task Assignments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Task No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Task Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{task.taskNo}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{task.staffName}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{task.clientName}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{task.taskType}</td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {new Date(task.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.status === "Completed"
                          ? "bg-green-500/10 text-green-500"
                          : task.status === "In Progress"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {task.status}
                    </span>
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
