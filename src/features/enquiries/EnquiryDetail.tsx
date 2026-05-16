import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, User, Phone, Mail, Building, Calendar, FileText, Download, Upload, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

// Mock data
const mockEnquiries = [
  {
    id: 1,
    enquiryNo: "ENQ-2026-001",
    date: "2026-05-10",
    clientName: "ABC Corporation",
    contactPerson: "John Doe",
    phone: "+91 98765 43210",
    email: "john@abccorp.com",
    requirement: "HVAC System Installation",
    description: "Need complete HVAC system for 50,000 sq ft office building with 5 floors",
    status: "Site Visit Scheduled",
    priority: "High",
    assignedTo: "Rajesh Kumar",
    followUpDate: "2026-05-20",
    drawings: [
      { name: "Floor_Plan.pdf", uploadDate: "2026-05-11", uploadedBy: "Client" },
      { name: "HVAC_Layout.dwg", uploadDate: "2026-05-12", uploadedBy: "Rajesh Kumar" },
    ],
  },
];

const getStatusColor = (status: string) => {
  const colors = {
    "Site Visit Scheduled": "bg-blue-100 text-blue-800",
    "Quotation Prepared": "bg-green-100 text-green-800",
    "Follow-up Required": "bg-amber-100 text-amber-800",
    "Converted to Quotation": "bg-purple-100 text-purple-800",
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const getPriorityColor = (priority: string) => {
  const colors = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-amber-100 text-amber-800",
    Low: "bg-blue-100 text-blue-800",
  };
  return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export function EnquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const enquiry = mockEnquiries.find(e => e.id === Number(id)) || mockEnquiries[0];

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
                      onClick={() => navigate("/enquiries")}
                      className="gap-2 h-9 px-3 hover:bg-gray-100"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="font-medium">Back</span>
                    </Button>
                    <div className="h-8 w-px bg-gray-200 hidden md:block" />
                    <div>
                      <h1 className="text-xl font-bold text-gray-900 tracking-tight">{enquiry.enquiryNo}</h1>
                      <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">{enquiry.clientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-full ${getPriorityColor(enquiry.priority)}`}>
                      {enquiry.priority} Priority
                    </span>
                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-full ${getStatusColor(enquiry.status)}`}>
                      {enquiry.status}
                    </span>
                    <Button size="sm" className="bg-pink-700 hover:bg-pink-800 h-9 px-4 font-semibold">Create Quotation</Button>
                  </div>
                </div>
                <div className="px-4 lg:px-5">
                  <TabsList className="h-12 bg-transparent p-0 gap-8">
                    <TabsTrigger 
                      value="details" 
                      className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-pink-600 data-[state=active]:text-pink-700 data-[state=active]:bg-pink-50/50 data-[state=active]:shadow-none px-4 text-sm font-bold transition-all"
                    >
                      Enquiry Details
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value="details" className="m-0">
                <div className="space-y-4">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Enquiry Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <div className="h-8 w-8 rounded-lg bg-pink-100 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-pink-700" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Enquiry Information</h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-y-3 gap-x-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Enquiry Number</label>
                    <p className="mt-1 text-gray-900 font-semibold">{enquiry.enquiryNo}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Enquiry Date</label>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{new Date(enquiry.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assigned To</label>
                    <div className="mt-0.5 flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full overflow-hidden shrink-0 border border-pink-100">
                        <img 
                          src={`https://i.pravatar.cc/150?u=${encodeURIComponent(enquiry.assignedTo)}`} 
                          alt={enquiry.assignedTo} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-900 font-medium">{enquiry.assignedTo}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Follow-up Date</label>
                    <div className="mt-1 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <p className="text-gray-900 font-medium">{new Date(enquiry.followUpDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <Building className="h-4 w-4 text-blue-700" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Client Information</h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-y-3 gap-x-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Client Name</label>
                    <p className="mt-1 text-gray-900 font-semibold">{enquiry.clientName}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Person</label>
                    <div className="mt-0.5 flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full overflow-hidden shrink-0 border border-blue-100">
                        <img 
                          src={`https://i.pravatar.cc/150?u=${encodeURIComponent(enquiry.contactPerson)}`} 
                          alt={enquiry.contactPerson} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-900 font-medium">{enquiry.contactPerson}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Phone</label>
                    <div className="mt-1 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{enquiry.phone}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                    <div className="mt-1 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{enquiry.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirement Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-green-700" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Requirement</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Service Required</label>
                    <p className="mt-0.5 text-gray-900 font-semibold text-base">{enquiry.requirement}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</label>
                    <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">{enquiry.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawings & Documents */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-purple-700" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Drawings & Documents</h3>
                </div>
                <Button size="sm" className="gap-2 h-8">
                  <Upload className="h-3.5 w-3.5" />
                  Upload
                </Button>
              </div>

              {enquiry.drawings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {enquiry.drawings.map((drawing, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-blue-700" />
                    </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">{drawing.name}</p>
                          <p className="text-xs text-gray-500">
                            {drawing.uploadedBy} • {new Date(drawing.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="ml-2 flex-shrink-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium mb-1">No drawings uploaded yet</p>
                  <p className="text-sm text-gray-500">Upload site drawings, floor plans, or technical documents</p>
                </div>
              )}
            </div>

            {/* Activity Timeline Placeholder */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Activity Timeline</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-7 w-7 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                      <Calendar className="h-3.5 w-3.5 text-pink-700" />
                    </div>
                    <div className="w-px h-full bg-gray-200 mt-2" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-gray-900">Enquiry Created</p>
                    <p className="text-[11px] text-gray-500">{new Date(enquiry.date).toLocaleDateString()} • System</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-7 w-7 rounded-full overflow-hidden shrink-0 border border-blue-100 shadow-sm">
                      <img 
                        src={`https://i.pravatar.cc/150?u=admin`} 
                        alt="Admin" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Assigned to {enquiry.assignedTo}</p>
                    <p className="text-[11px] text-gray-500">{new Date(enquiry.date).toLocaleDateString()} • Admin</p>
                  </div>
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
