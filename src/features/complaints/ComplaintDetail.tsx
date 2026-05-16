import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, User, Phone, Building, MapPin, Calendar, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ServiceTracking } from "../../components/ServiceTracking";
import { Textarea } from "../../components/ui/textarea";
import { ScrollArea } from "../../components/ui/scroll-area";

// Mock data
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
];

const getStatusColor = (status: string) => {
  const colors = {
    Pending: "bg-amber-100 text-amber-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Resolved: "bg-green-100 text-green-800",
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const getPriorityColor = (priority: string) => {
  const colors = {
    Critical: "bg-red-100 text-red-800",
    High: "bg-orange-100 text-orange-800",
    Medium: "bg-amber-100 text-amber-800",
    Low: "bg-blue-100 text-blue-800",
  };
  return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newRemark, setNewRemark] = useState("");

  const complaint = mockComplaints.find(c => c.id === Number(id)) || mockComplaints[0];

  return (
    <div className="h-full bg-gray-50/50">
      <ScrollArea className="h-full">
        <div className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-4">
            <Tabs defaultValue="details" className="space-y-4">
              {/* Unified Header Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 lg:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/complaints")}
                      className="gap-2 h-9 px-3 hover:bg-gray-100"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="font-medium">Back</span>
                    </Button>
                    <div className="h-8 w-px bg-gray-200 hidden md:block" />
                    <div>
                      <h1 className="text-xl font-bold text-gray-900 tracking-tight">{complaint.complaintNo}</h1>
                      <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">{complaint.clientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-full ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-full ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                    <Button size="sm" className="bg-pink-700 hover:bg-pink-800 h-9 px-4 font-semibold">Update Status</Button>
                  </div>
                </div>
                <div className="px-4 lg:px-5">
                  <TabsList className="h-12 bg-transparent p-0 gap-8">
                    <TabsTrigger 
                      value="details" 
                      className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-pink-600 data-[state=active]:bg-pink-50/50 data-[state=active]:shadow-none data-[state=active]:text-pink-700 px-4 text-sm font-bold transition-all"
                    >
                      Complaint Details
                    </TabsTrigger>
                    <TabsTrigger 
                      value="service" 
                      className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-pink-600 data-[state=active]:bg-pink-50/50 data-[state=active]:shadow-none data-[state=active]:text-pink-700 px-4 text-sm font-bold transition-all"
                    >
                      Service History
                    </TabsTrigger>
                    <TabsTrigger 
                      value="remarks" 
                      className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-pink-600 data-[state=active]:bg-pink-50/50 data-[state=active]:shadow-none data-[state=active]:text-pink-700 px-4 text-sm font-bold transition-all"
                    >
                      Remarks
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value="details" className="m-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Complaint Information Card */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                      <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                        <AlertCircle className="h-4 w-4 text-red-700" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Complaint Information</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Complaint Number</label>
                        <p className="mt-1 text-gray-900 font-semibold">{complaint.complaintNo}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Issue</label>
                        <p className="mt-1 text-gray-900 font-semibold text-lg">{complaint.issue}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Description</label>
                        <p className="mt-1 text-gray-700 leading-relaxed">{complaint.description}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assigned To</label>
                        <div className="mt-0.5 flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full overflow-hidden shrink-0 border border-pink-100">
                            <img 
                              src={`https://i.pravatar.cc/150?u=${encodeURIComponent(complaint.assignedTo)}`} 
                              alt={complaint.assignedTo} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="text-sm text-gray-900 font-medium">{complaint.assignedTo}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Client Information Card */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <Building className="h-4 w-4 text-blue-700" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Client Information</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Client Name</label>
                        <p className="mt-1 text-gray-900 font-semibold">{complaint.clientName}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Person</label>
                        <div className="mt-0.5 flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full overflow-hidden shrink-0 border border-blue-100">
                            <img 
                              src={`https://i.pravatar.cc/150?u=${encodeURIComponent(complaint.contactPerson)}`} 
                              alt={complaint.contactPerson} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="text-sm text-gray-900 font-medium">{complaint.contactPerson}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Phone</label>
                        <div className="mt-1 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-900">{complaint.phone}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Location</label>
                        <div className="mt-1 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-900">{complaint.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Card */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                      <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                        <Calendar className="h-4 w-4 text-green-700" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Timeline</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Reported Date</label>
                        <p className="mt-1 text-gray-900">{new Date(complaint.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Expected Resolution</label>
                        <p className="mt-1 text-pink-700 font-semibold">{new Date(complaint.expectedResolution).toLocaleDateString()}</p>
                      </div>
                      <div className="pt-4">
                        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-5 w-5 text-pink-700" />
                            <span className="font-semibold text-gray-900">Days Remaining</span>
                          </div>
                          <p className="text-3xl font-bold text-pink-700">
                            {Math.ceil((new Date(complaint.expectedResolution).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">Until expected resolution</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="service" className="m-0">
                <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm">
                  <ServiceTracking
                    serviceType="Complaint"
                    serviceNo={complaint.complaintNo}
                    logs={complaint.serviceLogs}
                  />
                </div>
              </TabsContent>

              <TabsContent value="remarks" className="m-0">
                <div className="space-y-6">
                  <div className="space-y-3">
                    {complaint.remarks.length > 0 ? (
                      complaint.remarks.map((remark, idx) => (
                        <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 border border-pink-100 shadow-sm">
                                <img 
                                  src={`https://i.pravatar.cc/150?u=${encodeURIComponent(remark.user)}`} 
                                  alt={remark.user} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <span className="font-medium text-gray-900">{remark.user}</span>
                            </div>
                            <span className="text-sm text-gray-500">{remark.date}</span>
                          </div>
                          <p className="text-gray-700 pl-11">{remark.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic text-center py-8">No remarks yet</p>
                    )}
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4">Add New Remark</h4>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Add a remark or update..."
                        value={newRemark}
                        onChange={(e) => setNewRemark(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                      <div className="flex justify-end">
                        <Button
                          className="gap-2"
                          onClick={() => {
                            if (newRemark.trim()) {
                              setNewRemark("");
                            }
                          }}
                        >
                          <MessageSquare className="h-4 w-4" />
                          Add Remark
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
