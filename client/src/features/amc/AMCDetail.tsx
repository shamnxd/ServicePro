import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Building, Phone, Mail, MapPin, DollarSign, MessageSquare } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ServiceTracking } from "../../components/ServiceTracking";
import { Textarea } from "../../components/ui/textarea";
import { ScrollArea } from "../../components/ui/scroll-area";

// Mock data - in real app, this would be fetched based on ID
const mockAMCContracts = [
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
];

const getStatusColor = (status: string) => {
  const colors = {
    Active: "bg-green-500/10 text-green-500",
    Expired: "bg-red-500/10 text-red-500",
    "Due for Renewal": "bg-amber-500/10 text-amber-500",
  };
  return colors[status as keyof typeof colors] || "bg-muted text-muted-foreground";
};

export function AMCDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newRemark, setNewRemark] = useState("");

  const contract = mockAMCContracts.find(c => c.id === Number(id)) || mockAMCContracts[0];

  return (
    <div className="h-full bg-background">
      <ScrollArea className="h-full">
        <div className="p-2 lg:p-0">
          <div className="mx-auto space-y-4">
            <Tabs defaultValue="details" className="space-y-4">
              {/* Unified Header Card */}
              <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-4 lg:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/amc")}
                      className="gap-2 h-9 px-3 hover:bg-muted"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="font-medium">Back</span>
                    </Button>
                    <div className="h-8 w-px bg-border hidden md:block" />
                    <div>
                      <h1 className="text-xl font-bold text-foreground tracking-tight">{contract.amcNo}</h1>
                      <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">{contract.clientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-full ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                    <Button size="sm" className="bg-pink-700 hover:bg-pink-800 h-9 px-4 font-semibold">Edit Contract</Button>
                  </div>
                </div>
                <div className="px-4 lg:px-5">
                  <TabsList className="w-fit h-12 bg-transparent p-0 rounded inline-flex flex-nowrap justify-start gap-6 lg:gap-8">
                    <TabsTrigger
                      value="details"
                      className="flex-none w-auto shrink-0 h-full rounded-md !border-b-2 border-0 border-transparent data-[state=active]:border-pink-600 data-[state=active]:bg-pink-50/50 data-[state=active]:shadow-none data-[state=active]:text-pink-700 px-4 text-sm font-bold transition-all"
                    >
                      Contract Details
                    </TabsTrigger>
                    <TabsTrigger
                      value="service"
                      className="flex-none w-auto shrink-0 h-full rounded-md !border-b-2 border-0 border-transparent data-[state=active]:border-pink-600 data-[state=active]:bg-pink-50/50 data-[state=active]:shadow-none data-[state=active]:text-pink-700 px-4 text-sm font-bold transition-all"
                    >
                      Service History
                    </TabsTrigger>
                    <TabsTrigger
                      value="remarks"
                      className="flex-none w-auto shrink-0 h-full rounded-md !border-b-2 border-0 border-transparent data-[state=active]:border-pink-600 data-[state=active]:bg-pink-50/50 data-[state=active]:shadow-none data-[state=active]:text-pink-700 px-4 text-sm font-bold transition-all"
                    >
                      Remarks
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value="details" className="m-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Contract Information Card */}
                    <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
                        <div className="h-8 w-8 rounded-lg bg-pink-500/10 flex items-center justify-center shrink-0">
                          <Calendar className="h-4 w-4 text-pink-600" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground">Contract Information</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">Contract Number</label>
                          <p className="mt-1 text-gray-900 font-semibold">{contract.amcNo}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">Plan Type</label>
                          <p className="mt-1 text-gray-900">{contract.planName}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">Service Type</label>
                          <p className="mt-1 text-gray-900">{contract.serviceType}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">Frequency</label>
                          <p className="mt-1 text-gray-900">{contract.frequency}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contract Value</label>
                          <p className="mt-0.5 text-pink-700 font-bold text-xl">₹{contract.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Client Information Card */}
                    <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
                        <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                          <Building className="h-4 w-4 text-blue-500" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground">Client Information</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">Client Name</label>
                          <p className="mt-1 text-gray-900 font-semibold">{contract.clientName}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Person</label>
                          <div className="mt-0.5 flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full overflow-hidden shrink-0 border border-blue-100">
                              <img
                                src={`https://i.pravatar.cc/150?u=${encodeURIComponent(contract.contactPerson)}`}
                                alt={contract.contactPerson}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <p className="text-sm text-gray-900 font-medium">{contract.contactPerson}</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">Phone</label>
                          <div className="mt-1 flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <p className="text-gray-900">{contract.phone}</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                          <div className="mt-1 flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <p className="text-gray-900">{contract.email}</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">Location</label>
                          <div className="mt-1 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <p className="text-gray-900">{contract.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contract Period & Progress Card */}
                    <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
                        <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                          <DollarSign className="h-4 w-4 text-green-500" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground">Period & Progress</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase">Start Date</label>
                            <p className="mt-1 text-gray-900">{new Date(contract.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase">End Date</label>
                            <p className="mt-1 text-gray-900">{new Date(contract.endDate).toLocaleDateString()}</p>
                          </div>
                          {contract.nextVisit && (
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase">Next Visit</label>
                              <p className="mt-1 text-pink-700 font-semibold">{new Date(contract.nextVisit).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex justify-between items-baseline mb-2">
                            <label className="text-xs font-medium text-gray-500 uppercase">Visits Progress</label>
                            <span className="text-sm font-semibold text-gray-900">
                              {contract.visitsCompleted}/{contract.totalVisits}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-3">
                            <div
                              className="bg-pink-600 h-3 rounded-full transition-all shadow-[0_0_8px_rgba(219,39,119,0.4)]"
                              style={{
                                width: `${(contract.visitsCompleted / contract.totalVisits) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3 mt-4">
                            <div className="bg-green-500/10 rounded-lg p-3 text-center">
                              <p className="text-xs text-muted-foreground mb-1">Completed</p>
                              <p className="text-2xl font-bold text-green-500">{contract.visitsCompleted}</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-3 text-center">
                              <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                              <p className="text-2xl font-bold text-foreground">{contract.totalVisits - contract.visitsCompleted}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="service" className="m-0">
                <div className="bg-card rounded-xl border border-border p-4 lg:p-6 shadow-sm">
                  <ServiceTracking
                    serviceType="AMC"
                    serviceNo={contract.amcNo}
                    logs={contract.serviceLogs}
                  />
                </div>
              </TabsContent>

              <TabsContent value="remarks" className="m-0">
                <div className="space-y-6">
                  <div className="space-y-3">
                    {contract.remarks.length > 0 ? (
                      contract.remarks.map((remark, idx) => (
                        <div key={idx} className="bg-card rounded-xl border border-border p-5 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 border border-pink-500/20 shadow-sm">
                                <img
                                  src={`https://i.pravatar.cc/150?u=${encodeURIComponent(remark.user)}`}
                                  alt={remark.user}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <span className="font-medium text-foreground">{remark.user}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{remark.date}</span>
                          </div>
                          <p className="text-muted-foreground pl-11">{remark.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic text-center py-8">No remarks yet</p>
                    )}
                  </div>

                  <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                    <h4 className="font-semibold text-foreground mb-4">Add New Remark</h4>
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
