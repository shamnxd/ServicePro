import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft, Edit, Trash2, Phone, Mail, MapPin, Building2,
  User, FileText, ShieldCheck, ShieldX, Shield, Loader2,
  MoreVertical, AlertTriangle, MessageSquare,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../components/ui/alert-dialog";
import { Client } from "../../interfaces/client.interface";
import { getClientByIdApi, deleteClientApi } from "../../api/client.api";
import { ClientFormModal } from "./ClientFormModal";
import { mockComplaints } from "../complaints/Complaints";
import { mockEnquiries } from "../enquiries/Enquiries";

export function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchClient = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await getClientByIdApi(id);
      if (res.success) {
        setClient(res.data);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await deleteClientApi(id);
      if (res.success) navigate("/clients");
    } catch (err) {
      console.error("Failed to delete client:", err);
    }
  };

  // Related mock data
  const activeComplaints = client
    ? mockComplaints.filter(
        (c) =>
          c.clientName.toLowerCase() === client.companyName.toLowerCase() &&
          c.status !== "Resolved"
      )
    : [];

  const allComplaints = client
    ? mockComplaints.filter(
        (c) => c.clientName.toLowerCase() === client.companyName.toLowerCase()
      )
    : [];

  const activeEnquiries = client
    ? mockEnquiries.filter(
        (e) =>
          e.clientName.toLowerCase() === client.companyName.toLowerCase() &&
          e.status !== "Converted to Project"
      )
    : [];

  // AMC badge helper
  const amcBadge = (status?: string) => {
    if (status === "Active")
      return { icon: ShieldCheck, color: "text-green-600", bg: "bg-green-500/10", label: "Active AMC" };
    if (status === "Expired")
      return { icon: ShieldX, color: "text-red-500", bg: "bg-red-500/10", label: "Expired AMC" };
    return { icon: Shield, color: "text-muted-foreground", bg: "bg-muted", label: "No AMC" };
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm">Loading client details...</p>
      </div>
    );
  }

  // ── Not Found ──
  if (notFound || !client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-semibold text-foreground">Client not found</p>
        <Button variant="outline" onClick={() => navigate("/clients")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Clients
        </Button>
      </div>
    );
  }

  const amc = amcBadge(client.amcStatus);
  const AmcIcon = amc.icon;

  return (
    <div className="space-y-4 pb-8">
      {/* ── Header Card ── */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Top banner accent */}
        <div className="h-2 bg-gradient-to-r from-primary via-pink-400 to-primary/40" />

        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left: back + title */}
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/clients")}
              className="gap-2 h-9 px-3 hover:bg-muted shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Back</span>
            </Button>

            <div className="h-8 w-px bg-border hidden sm:block shrink-0" />

            <div className="flex items-center gap-3 min-w-0">
              <div className="h-11 w-11 rounded-full overflow-hidden shrink-0 border-2 border-primary/20 shadow">
                <img
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(client.companyName)}&backgroundColor=be185d&fontSize=40&fontWeight=700`}
                  alt={client.companyName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-foreground truncate leading-tight">
                  {client.companyName}
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">{client.contactPerson}</p>
              </div>
            </div>
          </div>

          {/* Right: AMC badge + actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${amc.bg} ${amc.color}`}>
              <AmcIcon className="h-3.5 w-3.5" />
              {amc.label}
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <MoreVertical className="h-4 w-4" />
                  <span className="hidden sm:inline">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4 text-green-500" /> Edit Client
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setIsDeleteOpen(true)}
                  className="cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4 text-destructive" /> Delete Client
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── Col 1–2: Details ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Contact & Company Info */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-base font-semibold text-foreground">Company Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoField label="Company Name" value={client.companyName} />
              <InfoField label="Contact Person">
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-7 w-7 rounded-full overflow-hidden shrink-0 border border-border">
                    <img
                      src={`https://i.pravatar.cc/150?u=${encodeURIComponent(client.contactPerson)}`}
                      alt={client.contactPerson}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-foreground font-medium">{client.contactPerson}</span>
                </div>
              </InfoField>
              <InfoField label="Phone">
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <a href={`tel:${client.phone}`} className="text-sm text-foreground hover:text-primary transition-colors">
                    {client.phone}
                  </a>
                </div>
              </InfoField>
              <InfoField label="Email">
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <a href={`mailto:${client.email}`} className="text-sm text-foreground hover:text-primary transition-colors truncate">
                    {client.email}
                  </a>
                </div>
              </InfoField>
              <InfoField label="City">
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-foreground">{client.city}</span>
                </div>
              </InfoField>
              <InfoField label="GST Number" value={client.gst || "N/A"} mono />
              {client.address && (
                <div className="sm:col-span-2">
                  <InfoField label="Address" value={client.address} />
                </div>
              )}
            </div>
          </div>

          {/* Active Complaints */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                </div>
                <h2 className="text-base font-semibold text-foreground">Complaints</h2>
              </div>
              <div className="flex items-center gap-2">
                {activeComplaints.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold">
                    {activeComplaints.length} active
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{allComplaints.length} total</span>
              </div>
            </div>

            {allComplaints.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No complaints on record</p>
              </div>
            ) : (
              <div className="space-y-2">
                {allComplaints.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/50">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{c.complaintNo ?? `Complaint #${idx + 1}`}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.issue ?? c.description ?? "—"}</p>
                    </div>
                    <span className={`ml-3 shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      c.status === "Resolved"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-orange-500/10 text-orange-500"
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Enquiries */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                </div>
                <h2 className="text-base font-semibold text-foreground">Enquiries</h2>
              </div>
              {activeEnquiries.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold">
                  {activeEnquiries.length} active
                </span>
              )}
            </div>

            {activeEnquiries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No active enquiries</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeEnquiries.map((e, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/50">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{e.enquiryNo ?? `Enquiry #${idx + 1}`}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{e.requirement ?? e.description ?? "—"}</p>
                    </div>
                    <span className="ml-3 shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-500">
                      {e.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Col 3: Sidebar Stats ── */}
        <div className="space-y-4">

          {/* Quick Stats */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-purple-500" />
              </div>
              <h2 className="text-base font-semibold text-foreground">Quick Stats</h2>
            </div>

            <div className="space-y-3">
              <StatRow label="Total Projects" value={client.projectsCount ?? 0} color="text-foreground" />
              <StatRow label="Active Complaints" value={activeComplaints.length} color="text-orange-500" />
              <StatRow label="Active Enquiries" value={activeEnquiries.length} color="text-blue-500" />
              <StatRow label="Total Complaints" value={allComplaints.length} color="text-muted-foreground" />
            </div>
          </div>

          {/* AMC Status Card */}
          <div className={`rounded-xl border p-4 sm:p-5 shadow-sm ${amc.bg} border-border`}>
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${amc.bg}`}>
                <AmcIcon className={`h-5 w-5 ${amc.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">AMC Status</p>
                <p className={`text-lg font-bold ${amc.color}`}>{client.amcStatus ?? "None"}</p>
              </div>
            </div>
          </div>

          {/* Client Since */}
          {client.createdAt && (
            <div className="bg-card rounded-xl border border-border shadow-sm p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Client Since</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {new Date(client.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Edit Modal ── */}
      <ClientFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={(updated) => {
          setClient(updated);
          setIsEditOpen(false);
        }}
        client={client}
      />

      {/* ── Delete Confirmation ── */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this client?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{client.companyName}</strong> and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── Helper sub-components ──
function InfoField({
  label,
  value,
  mono,
  children,
}: {
  label: string;
  value?: string | number;
  mono?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
      {children ? (
        children
      ) : (
        <p className={`mt-1 text-sm text-foreground ${mono ? "font-mono" : "font-medium"}`}>
          {value ?? "—"}
        </p>
      )}
    </div>
  );
}

function StatRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );
}
