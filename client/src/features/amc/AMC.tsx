import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  CalendarClock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
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
import type { AmcContract } from "../../interfaces/amc.interface";
import { getAmcApi, deleteAmcApi } from "../../api/amc.api";
import { AmcFormModal } from "../../components/AmcFormModal";
import { AmcScheduleVisitModal } from "../../components/AmcScheduleVisitModal";
import { canRenewAmc } from "../../utils/amcRenewal";
import { RefreshCw } from "lucide-react";
import { NextVisitCell } from "../../components/NextVisitCell";
import { calculateNextPreferredVisitDate } from "../../utils/calculateAmcVisits";
import { useDebounce } from "../../hooks/useDebounce";
import { ReusableTable } from "../../components/ReusableTable";
import { FilterStatChips } from "../../components/FilterStatChips";
import { toast } from "sonner";

type StatusFilter = "all" | "Active" | "Due for Renewal" | "Expired";

const statusFilterLabels: Record<StatusFilter, string> = {
  all: "All Status",
  Active: "Active",
  "Due for Renewal": "Due for Renewal",
  Expired: "Expired",
};

const PAGE_SIZE = 10;

function fmtDate(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function AMC() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [contracts, setContracts] = useState<AmcContract[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editContract, setEditContract] = useState<AmcContract | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [scheduleContract, setScheduleContract] = useState<AmcContract | null>(null);
  const [renewContract, setRenewContract] = useState<AmcContract | null>(null);
  const [stats, setStats] = useState({ total: 0, active: 0, renewal: 0, expired: 0 });

  const fetchStats = useCallback(async () => {
    try {
      const [all, active, renewal, expired] = await Promise.all([
        getAmcApi({ page: 1, limit: 1 }),
        getAmcApi({ page: 1, limit: 1, status: "Active" }),
        getAmcApi({ page: 1, limit: 1, status: "Due for Renewal" }),
        getAmcApi({ page: 1, limit: 1, status: "Expired" }),
      ]);
      setStats({
        total: all.total ?? 0,
        active: active.total ?? 0,
        renewal: renewal.total ?? 0,
        expired: expired.total ?? 0,
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchContracts = useCallback(
    async (page: number, search: string, status: StatusFilter) => {
      setIsLoading(true);
      try {
        const res = await getAmcApi({
          page,
          limit: PAGE_SIZE,
          search: search || undefined,
          status: status !== "all" ? status : undefined,
        });
        if (res.success) {
          setContracts(res.data);
          setTotal(res.total);
          setTotalPages(res.totalPages);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load AMC contracts");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchContracts(currentPage, debouncedSearch, statusFilter);
  }, [currentPage, debouncedSearch, statusFilter, fetchContracts]);

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      Active: "bg-green-500/10 text-green-600",
      "Due for Renewal": "bg-amber-500/10 text-amber-600",
      Expired: "bg-red-500/10 text-red-500",
    };
    return map[status] ?? "bg-muted text-muted-foreground";
  };

  const renderActions = (c: AmcContract) => (
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
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              c.id && navigate(`/amc/${c.id}`);
            }}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4 text-blue-500" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setScheduleContract(c);
            }}
            className="cursor-pointer"
          >
            <CalendarClock className="mr-2 h-4 w-4 text-pink-600" />
            Schedule Visit
          </DropdownMenuItem>
          {canRenewAmc(c) && (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setRenewContract(c);
              }}
              className="cursor-pointer"
            >
              <RefreshCw className="mr-2 h-4 w-4 text-amber-600" />
              Renew AMC
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setEditContract(c);
            }}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4 text-green-500" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => {
              e.preventDefault();
              c.id && setDeleteId(c.id);
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

  const columns = [
    {
      header: "Contract",
      accessor: (c: AmcContract) => (
        <div className="min-w-0">
          <p className="font-semibold text-foreground leading-tight truncate max-w-[180px]">{c.amcNo}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[180px]">{c.serviceType}</p>
        </div>
      ),
      className: "px-4 py-4 w-[200px] min-w-[180px]",
    },
    {
      header: "Client",
      accessor: (c: AmcContract) => (
        <div className="min-w-0">
          <p className="font-semibold text-foreground leading-tight truncate max-w-[180px]">
            {c.clientName}
          </p>
          {c.email?.trim() && (
            <p className="text-xs text-muted-foreground truncate max-w-[180px]">{c.email}</p>
          )}
        </div>
      ),
      className: "px-4 py-4 w-[180px] min-w-[150px]",
    },
    {
      header: "Expires",
      accessor: (c: AmcContract) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">{fmtDate(c.endDate)}</span>
      ),
      className: "px-4 py-4 w-[120px]",
    },
    {
      header: "Visits",
      accessor: (c: AmcContract) => (
        <span className="text-sm font-medium text-foreground whitespace-nowrap">
          {c.visitsCompleted}/{c.totalVisits}
        </span>
      ),
      className: "px-4 py-4 w-[80px]",
    },
    {
      header: "Preferred Visit",
      accessor: (c: AmcContract) => (
        <NextVisitCell
          nextVisit={calculateNextPreferredVisitDate(
            c.startDate,
            c.endDate,
            c.visitsCompleted,
            c.totalVisits
          )}
          emptyLabel="All visits done"
        />
      ),
      className: "px-4 py-4 w-[150px]",
    },
    {
      header: "Scheduled Visit",
      accessor: (c: AmcContract) => (
        <NextVisitCell nextVisit={c.nextVisit} emptyLabel="Not scheduled" />
      ),
      className: "px-4 py-4 w-[150px]",
    },
    {
      header: "Status",
      accessor: (c: AmcContract) => (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${statusColor(c.status)}`}>
          {c.status}
        </span>
      ),
      className: "px-4 py-4 w-[130px]",
    },
    {
      header: <span className="sr-only">Actions</span>,
      className: "px-4 py-4 text-right w-[52px]",
      accessor: (c: AmcContract) => renderActions(c),
    },
  ];

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAmcApi(deleteId);
      toast.success("AMC contract deleted");
      setDeleteId(null);
      fetchContracts(currentPage, debouncedSearch, statusFilter);
      fetchStats();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete contract");
    }
  };

  const refreshList = () => {
    fetchContracts(currentPage, debouncedSearch, statusFilter);
    fetchStats();
  };

  const startItem = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, total);

  const filterChips = [
    { value: "all" as StatusFilter, label: "All Contracts", count: stats.total, tone: "primary" as const },
    { value: "Active" as StatusFilter, label: "Active", count: stats.active, tone: "green" as const },
    { value: "Due for Renewal" as StatusFilter, label: "Due for Renewal", count: stats.renewal, tone: "amber" as const },
    { value: "Expired" as StatusFilter, label: "Expired", count: stats.expired, tone: "red" as const },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">AMC Management</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Manage annual maintenance contracts</p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 shrink-0 bg-pink-700 hover:bg-pink-800 text-white font-semibold"
        >
          <Plus className="h-4 w-4" />
          Add AMC Contract
        </Button>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by AMC no, client, service type, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <FilterStatChips options={filterChips} value={statusFilter} onChange={setStatusFilter} />
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="px-4 sm:px-6 py-3 border-b border-border flex items-center justify-between gap-2">
          <p className="text-xs sm:text-sm text-muted-foreground min-w-0 truncate">
            {isLoading ? (
              "Loading..."
            ) : total === 0 ? (
              "No contracts found"
            ) : (
              <>
                Showing <span className="font-medium text-foreground">{startItem}–{endItem}</span> of{" "}
                <span className="font-medium text-foreground">{total}</span> contracts
                {statusFilter !== "all" && (
                  <span className="hidden sm:inline ml-1">
                    — filtered by{" "}
                    <span className="text-primary font-medium">{statusFilterLabels[statusFilter]}</span>
                  </span>
                )}
              </>
            )}
          </p>
          {statusFilter !== "all" && (
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline shrink-0"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="hidden md:block">
          <ReusableTable
            data={contracts}
            columns={columns}
            isLoading={isLoading}
            emptyMessage={
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <p className="text-sm">No AMC contracts found</p>
                {statusFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className="mt-2 text-xs text-primary hover:underline"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            }
            rowKey={(c) => c.id ?? c.amcNo}
            rowNumberStart={startItem || 1}
            onRowClick={(c) => c.id && navigate(`/amc/${c.id}`)}
          />
        </div>

        <div className="md:hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <span className="text-sm">Loading contracts...</span>
            </div>
          ) : contracts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p className="text-sm">No AMC contracts found</p>
              {statusFilter !== "all" && (
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {contracts.map((c, index) => (
                <div
                  key={c.id ?? c.amcNo}
                  className="px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => c.id && navigate(`/amc/${c.id}`)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground text-sm leading-tight truncate">{c.amcNo}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.clientName}</p>
                      {c.email?.trim() && (
                        <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.serviceType}</p>
                      <p className="text-xs text-muted-foreground mt-1">Expires {fmtDate(c.endDate)}</p>
                    </div>
                    <div className="flex items-start gap-2 shrink-0">
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground tabular-nums">
                          #{(startItem || 1) + index}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${statusColor(c.status)}`}>
                          {c.status}
                        </span>
                        <div className="flex flex-col items-end gap-1.5 text-right">
                          <div>
                            <p className="text-[9px] font-bold uppercase text-muted-foreground mb-0.5">
                              Preferred
                            </p>
                            <NextVisitCell
                              nextVisit={calculateNextPreferredVisitDate(
                                c.startDate,
                                c.endDate,
                                c.visitsCompleted,
                                c.totalVisits
                              )}
                              emptyLabel="All visits done"
                            />
                          </div>
                          <div>
                            <p className="text-[9px] font-bold uppercase text-muted-foreground mb-0.5">
                              Scheduled
                            </p>
                            <NextVisitCell nextVisit={c.nextVisit} emptyLabel="Not scheduled" />
                          </div>
                        </div>
                      </div>
                      {renderActions(c)}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>
                      {c.visitsCompleted}/{c.totalVisits} visits
                    </span>
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
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AmcFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={refreshList} contract={null} />
      <AmcFormModal
        isOpen={!!editContract}
        onClose={() => setEditContract(null)}
        onSuccess={refreshList}
        contract={editContract}
      />
      <AmcFormModal
        isOpen={!!renewContract}
        onClose={() => setRenewContract(null)}
        onSuccess={refreshList}
        contract={null}
        renewalSource={renewContract}
      />

      <AmcScheduleVisitModal
        isOpen={!!scheduleContract}
        onClose={() => setScheduleContract(null)}
        onSuccess={() => {
          refreshList();
          setScheduleContract(null);
        }}
        contract={scheduleContract}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete AMC contract?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone. The client AMC status will be updated.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
