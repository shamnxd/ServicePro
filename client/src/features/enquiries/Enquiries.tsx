import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  XCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
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
import { getEnquiriesApi, deleteEnquiryApi, updateEnquiryApi } from "../../api/enquiry.api";
import { getClientsApi } from "../../api/client.api";
import { Enquiry, EnquiryStatus } from "../../interfaces/enquiry.interface";
import { Client } from "../../interfaces/client.interface";
import { toast } from "sonner";
import { useDebounce } from "../../hooks/useDebounce";
import { ReusableTable } from "../../components/ReusableTable";
import { FilterStatChips } from "../../components/FilterStatChips";
import { EnquiryFormModal } from "../../components/EnquiryFormModal";

type StatusFilter = "all" | EnquiryStatus;

const filterLabels: Record<StatusFilter, string> = {
  all: "All",
  "Site Visit Scheduled": "Site Visit",
  "Quotation Prepared": "Quotation",
  "Follow-up Required": "Follow-up",
  "Converted to Project": "Converted",
  Closed: "Closed",
};

const PAGE_SIZE = 10;

export function Enquiries() {
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

  const [stats, setStats] = useState({
    total: 0,
    siteVisit: 0,
    quotation: 0,
    followUp: 0,
    converted: 0,
    closed: 0,
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editEnquiry, setEditEnquiry] = useState<Enquiry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [closeId, setCloseId] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const [allRes, siteRes, quoteRes, followRes, convertedRes, closedRes] = await Promise.all([
        getEnquiriesApi({ page: 1, limit: 1 }),
        getEnquiriesApi({ page: 1, limit: 1, status: "Site Visit Scheduled" }),
        getEnquiriesApi({ page: 1, limit: 1, status: "Quotation Prepared" }),
        getEnquiriesApi({ page: 1, limit: 1, status: "Follow-up Required" }),
        getEnquiriesApi({ page: 1, limit: 1, status: "Converted to Project" }),
        getEnquiriesApi({ page: 1, limit: 1, status: "Closed" }),
      ]);
      setStats({
        total: allRes.total ?? 0,
        siteVisit: siteRes.total ?? 0,
        quotation: quoteRes.total ?? 0,
        followUp: followRes.total ?? 0,
        converted: convertedRes.total ?? 0,
        closed: closedRes.total ?? 0,
      });
    } catch (err) {
      console.error("Failed to fetch enquiry stats:", err);
    }
  }, []);

  const fetchEnquiries = useCallback(async (page: number, search: string, filter: StatusFilter) => {
    setIsLoading(true);
    try {
      const res = await getEnquiriesApi({
        search: search || undefined,
        status: filter === "all" ? undefined : filter,
        page,
        limit: PAGE_SIZE,
      });
      if (res.success) {
        setEnquiries(res.data);
        setTotal(res.total ?? 0);
        setTotalPages(res.totalPages ?? 0);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load enquiries");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchClients = useCallback(async () => {
    try {
      const res = await getClientsApi({ page: 1, limit: 200 });
      if (res.success) setClients(res.data);
    } catch (err) {
      console.error("Failed to load clients", err);
    }
  }, []);

  const refreshList = useCallback(() => {
    fetchEnquiries(currentPage, debouncedSearch, activeFilter);
    fetchStats();
  }, [currentPage, debouncedSearch, activeFilter, fetchEnquiries, fetchStats]);

  useEffect(() => {
    fetchStats();
    fetchClients();
  }, [fetchStats, fetchClients]);

  useEffect(() => {
    fetchEnquiries(currentPage, debouncedSearch, activeFilter);
  }, [currentPage, debouncedSearch, activeFilter, fetchEnquiries]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeFilter]);

  const handleClose = async () => {
    if (!closeId) return;
    try {
      await updateEnquiryApi(closeId, { status: "Closed" });
      toast.success("Enquiry closed");
      setCloseId(null);
      refreshList();
    } catch (err) {
      console.error(err);
      toast.error("Failed to close enquiry");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteEnquiryApi(deleteId);
      toast.success("Enquiry deleted");
      setDeleteId(null);
      refreshList();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete enquiry");
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      "Site Visit Scheduled": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      "Quotation Prepared": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      "Follow-up Required": "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      "Converted to Project": "bg-green-500/10 text-green-600 dark:text-green-400",
      Closed: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide whitespace-nowrap ${
          map[status] ?? "bg-muted text-muted-foreground"
        }`}
      >
        {status}
      </span>
    );
  };

  const getPriorityBadge = (p: string) => {
    const map: Record<string, string> = {
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

  const renderEnquiryActions = (row: Enquiry) => (
    <div
      className="flex justify-end"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 hover:bg-muted rounded-full"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              row.id && navigate(`/enquiries/${row.id}`);
            }}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4 text-blue-500" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setEditEnquiry(row);
              setIsFormOpen(true);
            }}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4 text-green-500" />
            Edit
          </DropdownMenuItem>
          {row.status !== "Closed" && (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                if (row.id) setCloseId(row.id);
              }}
              className="cursor-pointer"
            >
              <XCircle className="mr-2 h-4 w-4 text-red-600" />
              Close Enquiry
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => {
              e.preventDefault();
              if (row.id) setDeleteId(row.id);
            }}
            className="cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const filterChips = [
    { value: "all" as StatusFilter, label: "Total", count: stats.total, tone: "primary" as const },
    { value: "Site Visit Scheduled" as StatusFilter, label: "Site Visit", count: stats.siteVisit, tone: "blue" as const },
    { value: "Quotation Prepared" as StatusFilter, label: "Quotation", count: stats.quotation, tone: "amber" as const },
    { value: "Follow-up Required" as StatusFilter, label: "Follow-up", count: stats.followUp, tone: "orange" as const },
    { value: "Converted to Project" as StatusFilter, label: "Converted", count: stats.converted, tone: "green" as const },
    { value: "Closed" as StatusFilter, label: "Closed", count: stats.closed, tone: "pink" as const },
  ];

  const columns = [
    {
      header: "Enquiry No.",
      accessor: (row: Enquiry) => (
        <div className="min-w-0">
          <p className="font-semibold text-foreground leading-tight truncate">{row.enquiryNo}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
            {new Date(row.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
        </div>
      ),
      className: "px-4 py-4 w-[130px]",
    },
    {
      header: "Client",
      accessor: (row: Enquiry) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-7 w-7 rounded-full overflow-hidden shrink-0 border border-border shadow-sm">
            <img
              src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(row.clientName)}&backgroundColor=be185d&fontSize=40&fontWeight=700`}
              alt={row.clientName}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground leading-tight truncate max-w-[120px]">{row.clientName}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[120px]">{row.contactPerson}</p>
          </div>
        </div>
      ),
      className: "px-4 py-4 w-[160px]",
    },
    {
      header: "Requirement",
      accessor: (row: Enquiry) => (
        <span className="text-sm text-foreground line-clamp-2 leading-snug break-words">{row.requirement}</span>
      ),
      className: "px-4 py-4 w-[200px] max-w-[200px]",
    },
    {
      header: "Priority",
      accessor: (row: Enquiry) => getPriorityBadge(row.priority),
      className: "px-4 py-4 w-[90px]",
    },
    {
      header: "Status",
      accessor: (row: Enquiry) => getStatusBadge(row.status),
      className: "px-4 py-4 w-[140px]",
    },
    {
      header: "Follow-up",
      accessor: (row: Enquiry) =>
        row.followUpDate ? (
          <div className="flex items-center gap-1.5 text-sm text-pink-600 font-medium whitespace-nowrap">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            {new Date(row.followUpDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        ),
      className: "px-4 py-4 w-[120px]",
    },
    {
      header: <span className="sr-only">Actions</span>,
      className: "px-4 py-4 text-right w-[52px]",
      accessor: (row: Enquiry) => renderEnquiryActions(row),
    },
  ];

  const startItem = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, total);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Enquiry Management</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Track and manage customer enquiries</p>
        </div>

        <Button
          onClick={() => {
            setEditEnquiry(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 shrink-0 bg-pink-700 hover:bg-pink-800 text-white font-semibold"
        >
          <Plus className="h-4 w-4" />
          Add Enquiry
        </Button>

        <EnquiryFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditEnquiry(null);
          }}
          onSuccess={refreshList}
          enquiry={editEnquiry}
          clients={clients}
          onClientsRefresh={fetchClients}
        />
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by enquiry no., client, requirement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <FilterStatChips options={filterChips} value={activeFilter} onChange={setActiveFilter} />
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="px-4 sm:px-6 py-3 border-b border-border flex items-center justify-between gap-2">
          <p className="text-xs sm:text-sm text-muted-foreground min-w-0 truncate">
            {isLoading ? (
              "Loading..."
            ) : total === 0 ? (
              "No enquiries found"
            ) : (
              <>
                Showing <span className="font-medium text-foreground">{startItem}–{endItem}</span> of{" "}
                <span className="font-medium text-foreground">{total}</span> enquiries
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
              type="button"
              onClick={() => setActiveFilter("all")}
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline shrink-0"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="hidden md:block">
          <ReusableTable
            data={enquiries}
            columns={columns}
            isLoading={isLoading}
            rowKey={(row) => row.id || row.enquiryNo}
            rowNumberStart={startItem || 1}
            onRowClick={(row) => row.id && navigate(`/enquiries/${row.id}`)}
            emptyMessage={
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <p className="text-sm">No enquiries found</p>
                {activeFilter !== "all" && (
                  <button type="button" onClick={() => setActiveFilter("all")} className="mt-2 text-xs text-primary hover:underline">
                    Clear filter
                  </button>
                )}
              </div>
            }
          />
        </div>

        <div className="md:hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <span className="text-sm">Loading enquiries...</span>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p className="text-sm">No enquiries found</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {enquiries.map((row, index) => (
                <div
                  key={row.id || row.enquiryNo}
                  className="px-4 py-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="min-w-0 flex-1 cursor-pointer"
                      onClick={() => row.id && navigate(`/enquiries/${row.id}`)}
                    >
                      <p className="font-semibold text-foreground text-sm">{row.enquiryNo}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{row.clientName}</p>
                      <p className="text-xs text-foreground mt-1 line-clamp-2">{row.requirement}</p>
                    </div>
                    <div className="flex items-start gap-2 shrink-0">
                      <span className="text-[10px] font-bold text-muted-foreground tabular-nums pt-1">
                        #{(startItem || 1) + index}
                      </span>
                      {renderEnquiryActions(row)}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {getPriorityBadge(row.priority)}
                    {getStatusBadge(row.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isLoading && totalPages > 1 && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
              Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
              <span className="font-medium text-foreground">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1 order-1 sm:order-2">
              <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)} className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                {currentPage} / {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={!!closeId} onOpenChange={() => setCloseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close enquiry?</AlertDialogTitle>
            <AlertDialogDescription>
              The enquiry will be marked as closed. You can reopen it later from the detail page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClose} className="bg-red-600 text-white hover:bg-red-700">
              Close Enquiry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete enquiry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The enquiry record will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
