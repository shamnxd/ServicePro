import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Plus, Search, Eye, AlertCircle, Calendar, MapPin,
  ChevronLeft, ChevronRight, UserPlus, MoreVertical, Loader2,
} from "lucide-react";
import { StaffSelectDropdown } from "../../components/StaffSelectDropdown";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import { Textarea } from "../../components/ui/textarea";
import { getComplaintsApi, createComplaintApi } from "../../api/complaint.api";
import { getClientsApi } from "../../api/client.api";
import { Complaint } from "../../interfaces/complaint.interface";
import { Client } from "../../interfaces/client.interface";
import { toast } from "sonner";
import { ClientFormModal } from "../clients/ClientFormModal";
import { useDebounce } from "../../hooks/useDebounce";
import { ReusableTable } from "../../components/ReusableTable";
import { FilterStatChips } from "../../components/FilterStatChips";

type StatusFilter = "all" | "Pending" | "In Progress" | "Resolved" | "Critical";

const filterLabels: Record<StatusFilter, string> = {
  all: "All",
  Pending: "Pending",
  "In Progress": "In Progress",
  Resolved: "Resolved",
  Critical: "Critical Priority",
};

const PAGE_SIZE = 10;

export function Complaints() {
  const navigate = useNavigate();

  // ── Table / List State ────────────────────────────────────────────────
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

  // ── Stats ─────────────────────────────────────────────────────────────
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
  });

  // ── Register Dialog State ─────────────────────────────────────────────
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [complaintDate, setComplaintDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [priority, setPriority] = useState("Medium");
  const [location, setLocation] = useState("");
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTechnicians, setAssignedTechnicians] = useState<string[]>([]);
  const [expectedResolution, setExpectedResolution] = useState("");

  // Client dropdown search (debounced, client-side)
  const [clientSearch, setClientSearch] = useState("");
  const debouncedClientSearch = useDebounce(clientSearch, 300);

  // Add New Client modal
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  // ── Fetch Stat Counts ─────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const [allRes, pendingRes, inProgressRes, resolvedRes, criticalRes] = await Promise.all([
        getComplaintsApi({ page: 1, limit: 1 }),
        getComplaintsApi({ page: 1, limit: 1, status: "Pending" }),
        getComplaintsApi({ page: 1, limit: 1, status: "In Progress" }),
        getComplaintsApi({ page: 1, limit: 1, status: "Resolved" }),
        getComplaintsApi({ page: 1, limit: 1, priority: "Critical" }),
      ]);
      setStats({
        total: allRes.total ?? 0,
        pending: pendingRes.total ?? 0,
        inProgress: inProgressRes.total ?? 0,
        resolved: resolvedRes.total ?? 0,
        critical: criticalRes.total ?? 0,
      });
    } catch (err) {
      console.error("Failed to fetch complaint stats:", err);
    }
  }, []);

  // ── Fetch Complaints ──────────────────────────────────────────────────
  const fetchComplaints = useCallback(async (page: number, search: string, filter: StatusFilter) => {
    setIsLoading(true);
    try {
      const statusParam =
        filter === "all" ? undefined
        : filter === "Critical" ? undefined   // Critical is a priority filter
        : filter;
      const priorityParam = filter === "Critical" ? "Critical" : undefined;

      const res = await getComplaintsApi({
        search: search || undefined,
        status: statusParam,
        priority: priorityParam,
        page,
        limit: PAGE_SIZE,
      });

      if (res.success) {
        setComplaints(res.data);
        setTotal(res.total ?? 0);
        setTotalPages(res.totalPages ?? 0);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load complaints");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Fetch Clients for dropdown ────────────────────────────────────────
  const fetchClients = useCallback(async () => {
    try {
      const res = await getClientsApi({ page: 1, limit: 200 });
      if (res.success) setClients(res.data);
    } catch (err) {
      console.error("Failed to load clients list", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchClients();
  }, [fetchStats, fetchClients]);

  useEffect(() => {
    fetchComplaints(currentPage, debouncedSearch, activeFilter);
  }, [currentPage, debouncedSearch, activeFilter, fetchComplaints]);

  // Reset to page 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeFilter]);

  // Auto-populate location from selected client
  useEffect(() => {
    if (selectedClientId && clients.length > 0) {
      const client = clients.find(c => c.id === selectedClientId || (c as any)._id === selectedClientId);
      if (client) {
        const clientLoc = client.address ? `${client.address}, ${client.city}` : client.city;
        setLocation(clientLoc || "");
      }
    } else {
      setLocation("");
    }
  }, [selectedClientId, clients]);

  // ── Register Complaint ────────────────────────────────────────────────
  const resetForm = () => {
    setSelectedClientId("");
    setIssue("");
    setDescription("");
    setLocation("");
    setExpectedResolution("");
    setPriority("Medium");
    setAssignedTechnicians([]);
    setComplaintDate(new Date().toISOString().split("T")[0]);
  };

  const handleRegisterComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === selectedClientId || (c as any)._id === selectedClientId);
    if (!client) { toast.error("Please select a valid client"); return; }
    if (!location.trim() || !issue.trim() || !description.trim() || !expectedResolution) {
      toast.error("All fields marked with * are required"); return;
    }
    try {
      const res = await createComplaintApi({
        date: new Date(complaintDate).toISOString(),
        clientId: selectedClientId,
        clientName: client.companyName,
        contactPerson: client.contactPerson,
        phone: client.phone,
        issue,
        description,
        priority: priority as any,
        status: "Pending" as any,
        assignedStaffIds: assignedTechnicians,
        location,
        expectedResolution: new Date(expectedResolution).toISOString(),
        remarks: [],
      });
      if (res.success) {
        toast.success("Complaint registered successfully!");
        setIsAddDialogOpen(false);
        resetForm();
        fetchComplaints(1, debouncedSearch, activeFilter);
        fetchStats();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to register complaint");
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────
  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      Resolved: "bg-green-500/10 text-green-600 dark:text-green-400",
      "In Progress": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${map[status] ?? "bg-muted text-muted-foreground"}`}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (p: string) => {
    const map: Record<string, string> = {
      Critical: "bg-red-500 text-white",
      High: "bg-red-500/10 text-red-600 dark:text-red-400",
      Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      Low: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${map[p] ?? "bg-muted text-muted-foreground"}`}>
        {p}
      </span>
    );
  };

  const priorityBorderColor = (p: string) => {
    if (p === "Critical") return "#ef4444";
    if (p === "High") return "#f97316";
    if (p === "Medium") return "#f59e0b";
    return "#10b981";
  };

  // ── Filtered clients for dropdown ─────────────────────────────────────
  const filteredClients = clients.filter(c =>
    debouncedClientSearch === "" ||
    c.companyName.toLowerCase().includes(debouncedClientSearch.toLowerCase()) ||
    c.contactPerson.toLowerCase().includes(debouncedClientSearch.toLowerCase())
  );

  const filterChips = [
    { value: "all" as StatusFilter, label: "Total", count: stats.total, tone: "primary" as const },
    { value: "Pending" as StatusFilter, label: "Pending", count: stats.pending, tone: "amber" as const },
    { value: "In Progress" as StatusFilter, label: "In Progress", count: stats.inProgress, tone: "blue" as const },
    { value: "Resolved" as StatusFilter, label: "Resolved", count: stats.resolved, tone: "green" as const },
    { value: "Critical" as StatusFilter, label: "Critical", count: stats.critical, tone: "red" as const },
  ];

  // ── Table Columns ─────────────────────────────────────────────────────
  const columns = [
    {
      header: "Complaint No.",
      accessor: (c: Complaint) => (
        <div className="min-w-0">
          <p className="font-semibold text-foreground leading-tight truncate">{c.complaintNo}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
            {new Date(c.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
        </div>
      ),
      className: "px-4 py-4 w-[130px]",
    },
    {
      header: "Client",
      accessor: (c: Complaint) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-7 w-7 rounded-full overflow-hidden shrink-0 border border-border shadow-sm">
            <img
              src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(c.clientName)}&backgroundColor=be185d&fontSize=40&fontWeight=700`}
              alt={c.clientName}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground leading-tight truncate max-w-[120px]">{c.clientName}</p>
            {c.contactPerson && <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[120px]">{c.contactPerson}</p>}
          </div>
        </div>
      ),
      className: "px-4 py-4 w-[160px]",
    },
    {
      header: "Issue",
      accessor: (c: Complaint) => (
        <div className="flex items-start gap-1.5 min-w-0">
          <AlertCircle className="h-3.5 w-3.5 text-pink-600 shrink-0 mt-0.5" />
          <span className="text-sm text-foreground line-clamp-2 leading-snug break-words">{c.issue}</span>
        </div>
      ),
      className: "px-4 py-4 w-[200px] max-w-[200px]",
    },
    {
      header: "Location",
      accessor: (c: Complaint) => (
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="text-sm text-muted-foreground truncate max-w-[110px]">{c.location}</span>
        </div>
      ),
      className: "px-4 py-4 w-[150px]",
    },
    {
      header: "Priority",
      accessor: (c: Complaint) => getPriorityBadge(c.priority),
      className: "px-4 py-4 w-[90px]",
    },
    {
      header: "Status",
      accessor: (c: Complaint) => getStatusBadge(c.status),
      className: "px-4 py-4 w-[110px]",
    },
    {
      header: "Exp. Resolution",
      accessor: (c: Complaint) => (
        <div className="flex items-center gap-1.5 text-sm text-pink-600 font-medium whitespace-nowrap">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          {new Date(c.expectedResolution).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
        </div>
      ),
      className: "px-4 py-4 w-[130px]",
    },
    {
      header: <span className="sr-only">Actions</span>,
      className: "px-4 py-4 text-right w-[52px]",
      accessor: (c: Complaint) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-muted rounded-full">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem
              onClick={() => navigate(`/complaints/${c.id || (c as any)._id}`)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4 text-blue-500" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const startItem = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, total);

  return (
    <div className="space-y-4">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Complaint Management</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Track and resolve customer complaints</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 shrink-0 bg-pink-700 hover:bg-pink-800 text-white font-semibold">
              <Plus className="h-4 w-4" />
              Register Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[calc(100vw-2rem)] sm:w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-lg bg-card border border-border shadow-lg p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">Register New Complaint</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRegisterComplaint} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Client dropdown with search */}
                <div>
                  <Label htmlFor="clientDropdown">Client *</Label>
                  <Select
                    value={selectedClientId}
                    onValueChange={setSelectedClientId}
                    onOpenChange={(open) => { if (!open) setClientSearch(""); }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select client from system" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Search input */}
                      <div className="px-2 py-2 border-b border-border/50">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                          <input
                            type="text"
                            value={clientSearch}
                            onChange={(e) => setClientSearch(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                            placeholder="Search clients..."
                            className="w-full pl-7 pr-2 py-1.5 text-sm bg-background border border-border rounded-md outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 placeholder:text-muted-foreground"
                          />
                        </div>
                      </div>

                      {/* Filtered list */}
                      {filteredClients.map((c) => (
                        <SelectItem key={c.id || (c as any)._id} value={c.id || (c as any)._id}>
                          {c.companyName}
                          {c.contactPerson && (
                            <span className="text-muted-foreground text-xs ml-1">— {c.contactPerson}</span>
                          )}
                        </SelectItem>
                      ))}

                      {filteredClients.length === 0 && (
                        <div className="px-2 py-3 text-sm text-center text-muted-foreground">No clients found</div>
                      )}

                      {/* Add New Client */}
                      <div
                        className="flex items-center gap-2 px-2 py-2 mt-1 border-t border-border/50 cursor-pointer text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/30 rounded-sm text-sm font-semibold transition-colors"
                        onMouseDown={(e) => { e.preventDefault(); setIsAddClientModalOpen(true); }}
                      >
                        <UserPlus className="h-4 w-4" />
                        Add New Client
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="complaintDate">Complaint Date *</Label>
                  <Input id="complaintDate" type="date" value={complaintDate} onChange={(e) => setComplaintDate(e.target.value)} className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="priority">Priority *</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location / Area</Label>
                  <Input id="location" value={location} disabled placeholder="Auto-populated from client" className="mt-1 bg-muted/40 text-muted-foreground cursor-not-allowed font-medium" />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="issue">Issue Title *</Label>
                  <Input id="issue" value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="Brief complaint title e.g. Split AC low cooling" className="mt-1" />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide details about the faulty unit or issues..." className="mt-1" rows={3} />
                </div>

                <div className="md:col-span-2">
                  <StaffSelectDropdown
                    selected={assignedTechnicians}
                    onChange={setAssignedTechnicians}
                    label="Assign Staff"
                    placement="top"
                  />
                </div>

                <div>
                  <Label htmlFor="expectedResolution">Expected Resolution *</Label>
                  <Input id="expectedResolution" type="date" value={expectedResolution} onChange={(e) => setExpectedResolution(e.target.value)} className="mt-1" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
                <Button type="button" variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>Cancel</Button>
                <Button type="submit" className="bg-pink-700 hover:bg-pink-800 text-white font-semibold">Register Complaint</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add New Client modal */}
        <ClientFormModal
          isOpen={isAddClientModalOpen}
          onClose={() => setIsAddClientModalOpen(false)}
          client={null}
          onSuccess={(newClient: Client) => {
            fetchClients().then(() => {
              const newId = (newClient as any)._id || newClient.id;
              if (newId) setSelectedClientId(newId);
            });
            toast.success(`Client "${newClient.companyName}" added and selected!`);
            setIsAddClientModalOpen(false);
          }}
        />
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by complaint no., client, issue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <FilterStatChips options={filterChips} value={activeFilter} onChange={setActiveFilter} />
      </div>

      {/* ── Table Container ─────────────────────────────────────────── */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">

        {/* Result count bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-border flex items-center justify-between gap-2">
          <p className="text-xs sm:text-sm text-muted-foreground min-w-0 truncate">
            {isLoading ? "Loading..." : total === 0 ? "No complaints found" : (
              <>
                Showing <span className="font-medium text-foreground">{startItem}–{endItem}</span> of{" "}
                <span className="font-medium text-foreground">{total}</span> complaints
                {activeFilter !== "all" && (
                  <span className="hidden sm:inline ml-1">
                    — filtered by <span className="text-primary font-medium">{filterLabels[activeFilter]}</span>
                  </span>
                )}
              </>
            )}
          </p>
          {activeFilter !== "all" && (
            <button
              onClick={() => setActiveFilter("all")}
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline shrink-0"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <ReusableTable
            data={complaints}
            columns={columns}
            isLoading={isLoading}
            rowKey={(c) => c.id || (c as any)._id || c.complaintNo}
            rowNumberStart={startItem || 1}
            onRowClick={(c) => navigate(`/complaints/${c.id || (c as any)._id}`)}
            emptyMessage={
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <p className="text-sm">No complaints found</p>
                {activeFilter !== "all" && (
                  <button onClick={() => setActiveFilter("all")} className="mt-2 text-xs text-primary hover:underline">
                    Clear filter
                  </button>
                )}
              </div>
            }
          />
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <span className="text-sm">Loading complaints...</span>
            </div>
          ) : complaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p className="text-sm">No complaints found</p>
              {activeFilter !== "all" && (
                <button onClick={() => setActiveFilter("all")} className="mt-2 text-xs text-primary hover:underline">Clear filter</button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {complaints.map((c) => (
                <div
                  key={c.id || (c as any)._id}
                  className="px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer border-l-4"
                  style={{ borderLeftColor: priorityBorderColor(c.priority) }}
                  onClick={() => navigate(`/complaints/${c.id || (c as any)._id}`)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 border border-border shadow-sm">
                        <img
                          src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(c.clientName)}&backgroundColor=be185d&fontSize=40&fontWeight=700`}
                          alt={c.clientName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm leading-tight">{c.complaintNo}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.clientName}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {getStatusBadge(c.status)}
                      {getPriorityBadge(c.priority)}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-foreground font-medium line-clamp-1">{c.issue}</p>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3" />{c.location}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-pink-600 font-medium">
                      <Calendar className="h-3 w-3" />
                      {new Date(c.expectedResolution).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
              Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
              <span className="font-medium text-foreground">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1 order-1 sm:order-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="hidden xs:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 5) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .reduce<(number | "...")[]>((acc, page, idx, arr) => {
                    if (idx > 0 && typeof arr[idx - 1] === "number" && (page as number) - (arr[idx - 1] as number) > 1) {
                      acc.push("...");
                    }
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground text-sm">…</span>
                    ) : (
                      <Button key={item} variant={currentPage === item ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(item as number)} className="h-8 w-8 p-0 text-xs">
                        {item}
                      </Button>
                    )
                  )}
              </div>

              <span className="xs:hidden text-sm text-muted-foreground px-2">{currentPage} / {totalPages}</span>

              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const mockComplaints: any[] = [];
