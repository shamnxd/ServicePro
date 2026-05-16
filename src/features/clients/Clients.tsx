import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, MapPin, Phone, Mail } from "lucide-react";
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

const mockClients = [
  {
    id: 1,
    companyName: "ABC Corporation",
    contactPerson: "John Doe",
    phone: "+91 98765 43210",
    email: "john@abccorp.com",
    gst: "29ABCDE1234F1Z5",
    city: "Mumbai",
    projectsCount: 5,
    amcStatus: "Active",
  },
  {
    id: 2,
    companyName: "XYZ Industries",
    contactPerson: "Jane Smith",
    phone: "+91 98765 43211",
    email: "jane@xyzind.com",
    gst: "27XYZAB5678G2Z3",
    city: "Delhi",
    projectsCount: 3,
    amcStatus: "Inactive",
  },
  {
    id: 3,
    companyName: "DEF Solutions",
    contactPerson: "Mike Johnson",
    phone: "+91 98765 43212",
    email: "mike@defsol.com",
    gst: "29DEFGH9012H3Z1",
    city: "Bangalore",
    projectsCount: 8,
    amcStatus: "Active",
  },
  {
    id: 4,
    companyName: "GHI Enterprises",
    contactPerson: "Sarah Williams",
    phone: "+91 98765 43213",
    email: "sarah@ghient.com",
    gst: "19GHIJK3456I4Z9",
    city: "Pune",
    projectsCount: 2,
    amcStatus: "Expired",
  },
];

export function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients] = useState(mockClients);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<typeof mockClients[0] | null>(null);

  const filteredClients = clients.filter(
    (client) =>
      client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
          <p className="text-gray-600 mt-1">Manage your client database</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input id="companyName" placeholder="Enter company name" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input id="contactPerson" placeholder="Enter contact person" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" placeholder="+91 XXXXX XXXXX" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="email@company.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="gst">GST Number</Label>
                  <Input id="gst" placeholder="GST Number" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" placeholder="Enter city" className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Full address" className="mt-1" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Client</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search clients by name, contact, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Clients</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{clients.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Active AMC</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {clients.filter((c) => c.amcStatus === "Active").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Expired AMC</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {clients.filter((c) => c.amcStatus === "Expired").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Projects</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {clients.reduce((sum, c) => sum + c.projectsCount, 0)}
          </p>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AMC Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                        <img
                          src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(client.companyName)}&backgroundColor=be185d&fontSize=40&fontWeight=700`}
                          alt={client.companyName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 leading-tight">{client.companyName}</p>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase">{client.gst}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {client.contactPerson}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        {client.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      {client.city}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {client.projectsCount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${client.amcStatus === "Active"
                          ? "bg-green-100 text-green-800"
                          : client.amcStatus === "Inactive"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {client.amcStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setIsViewDialogOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Client Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Company Name</label>
                  <p className="mt-1 text-gray-900">{selectedClient.companyName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact Person</label>
                  <p className="mt-1 text-gray-900">{selectedClient.contactPerson}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-gray-900">{selectedClient.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{selectedClient.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">GST Number</label>
                  <p className="mt-1 text-gray-900">{selectedClient.gst}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <p className="mt-1 text-gray-900">{selectedClient.city}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Projects</label>
                  <p className="mt-1 text-gray-900">{selectedClient.projectsCount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">AMC Status</label>
                  <p className="mt-1">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${selectedClient.amcStatus === "Active"
                          ? "bg-green-100 text-green-800"
                          : selectedClient.amcStatus === "Inactive"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {selectedClient.amcStatus}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button>Edit Client</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
