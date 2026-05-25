import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Plus, Search, Edit, Trash2, Eye, MapPin, Phone, Mail,
  Loader2, ChevronLeft, ChevronRight, MoreVertical, Filter, UserX, UserCheck,
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
import type { Staff as StaffRecord } from "../../interfaces/staff.interface";
import { getStaffDisplayRole, getStaffStatusLabel } from "../../interfaces/staff.interface";
import { getStaffApi, deleteStaffApi, updateStaffApi } from "../../api/staff.api";
import { StaffFormModal } from "../../components/StaffFormModal";
import { useDebounce } from "../../hooks/useDebounce";
import { ReusableTable } from "../../components/ReusableTable";
import { toast } from "sonner";

type EmploymentFilter = "all" | "Permanent" | "Temporary";

const employmentFilterLabels: Record<EmploymentFilter, string> = {
  all: "All Types",
  Permanent: "Permanent",
  Temporary: "Temporary",
};

const PAGE_SIZE = 10;

export function Staff() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [staffList, setStaffList] = useState<StaffRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [employmentFilter, setEmploymentFilter] = useState<EmploymentFilter>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<StaffRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, permanent: 0, temporary: 0 });

  const fetchStats = useCallback(async () => {
    try {
      const [all, perm, temp] = await Promise.all([
        getStaffApi({ page: 1, limit: 1, activeOnly: false }),
        getStaffApi({ page: 1, limit: 1, employmentType: "Permanent", activeOnly: false }),
        getStaffApi({ page: 1, limit: 1, employmentType: "Temporary", activeOnly: false }),
      ]);
      setStats({
        total: all.total ?? 0,
        permanent: perm.total ?? 0,
        temporary: temp.total ?? 0,
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const employmentCounts: Record<EmploymentFilter, number> = {
    all: stats.total,
    Permanent: stats.permanent,
    Temporary: stats.temporary,
  };

  const fetchStaff = useCallback(async (page: number, search: string, employment: EmploymentFilter) => {
    setIsLoading(true);
    try {
      const res = await getStaffApi({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        employmentType: employment !== "all" ? employment : undefined,
        activeOnly: false,
      });
      if (res.success) {
        setStaffList(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load staff");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, employmentFilter]);

  useEffect(() => {
    fetchStaff(currentPage, debouncedSearch, employmentFilter);
  }, [currentPage, debouncedSearch, employmentFilter, fetchStaff]);

  const statusColor = (label: string) => {
    const map: Record<string, string> = {
      Available: "bg-green-500/10 text-green-600",
      "On Site": "bg-blue-500/10 text-blue-600",
      "On Leave": "bg-muted text-muted-foreground",
      Inactive: "bg-red-500/10 text-red-500",
      Unavailable: "bg-red-500/10 text-red-500",
    };
    return map[label] ?? "bg-muted text-muted-foreground";
  };

  const handleToggleAvailability = async (s: StaffRecord, makeAvailable: boolean) => {
    if (!s.id) return;
    try {
      const res = await updateStaffApi(s.id, {
        isActive: makeAvailable,
        status: makeAvailable ? "Available" : "Inactive",
      });
      if (res.success) {
        toast.success(makeAvailable ? "Staff is now available for assignment" : "Staff marked as unavailable");
        fetchStaff(currentPage, debouncedSearch, employmentFilter);
        fetchStats();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update staff availability");
    }
  };

  const renderStaffActions = (s: StaffRecord) => (
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
              navigate(`/staff/${s.id}`);
            }}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4 text-blue-500" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setEditStaff(s);
            }}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4 text-green-500" />
            Edit
          </DropdownMenuItem>
          {s.isActive ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                handleToggleAvailability(s, false);
              }}
              className="cursor-pointer"
            >
              <UserX className="mr-2 h-4 w-4 text-amber-600" />
              Mark Unavailable
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                handleToggleAvailability(s, true);
              }}
              className="cursor-pointer"
            >
              <UserCheck className="mr-2 h-4 w-4 text-green-500" />
              Mark Available
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => {
              e.preventDefault();
              setDeleteId(s.id!);
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
      header: "Staff",
      accessor: (s: StaffRecord) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-full bg-pink-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
            {s.fullName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground leading-tight truncate max-w-[180px]">{s.fullName}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[180px]">{s.staffNo}</p>
          </div>
        </div>
      ),
      className: "px-4 py-4 w-[220px] min-w-[200px]",
    },
    {
      header: "Role",
      accessor: (s: StaffRecord) => (
        <span className="text-sm font-medium text-foreground whitespace-nowrap">{getStaffDisplayRole(s)}</span>
      ),
      className: "px-4 py-4 w-[140px] min-w-[120px]",
    },
    {
      header: "Type",
      accessor: (s: StaffRecord) => (
        <span
          className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full whitespace-nowrap ${
            s.employmentType === "Permanent"
              ? "bg-pink-500/10 text-pink-700"
              : "bg-amber-500/10 text-amber-700"
          }`}
        >
          {s.employmentType}
        </span>
      ),
      className: "px-4 py-4 w-[110px]",
    },
    {
      header: "Contact",
      accessor: (s: StaffRecord) => (
        <div className="space-y-1 text-sm text-muted-foreground min-w-0">
          <div className="flex items-center gap-1.5">
            <Phone className="h-3 w-3 shrink-0" />
            <span className="truncate max-w-[160px]">{s.phone}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate max-w-[160px]">{s.email}</span>
          </div>
        </div>
      ),
      className: "px-4 py-4 w-[200px] min-w-[180px]",
    },
    {
      header: "City",
      accessor: (s: StaffRecord) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate max-w-[100px]">{s.city}</span>
        </div>
      ),
      className: "px-4 py-4 w-[120px]",
    },
    {
      header: "Status",
      accessor: (s: StaffRecord) => {
        const label = getStaffStatusLabel(s);
        return (
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${statusColor(label)}`}>
            {label}
          </span>
        );
      },
      className: "px-4 py-4 w-[110px]",
    },
    {
      header: <span className="sr-only">Actions</span>,
      className: "px-4 py-4 text-right w-[52px]",
      accessor: (s: StaffRecord) => renderStaffActions(s),
    },
  ];

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteStaffApi(deleteId);
      toast.success("Staff deleted");
      setDeleteId(null);
      fetchStaff(currentPage, debouncedSearch, employmentFilter);
      fetchStats();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete staff");
    }
  };

  const startItem = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, total);

  const statCards = [
    {
      label: "All Types",
      value: stats.total,
      color: "text-foreground",
      filter: "all" as EmploymentFilter,
      bg: employmentFilter === "all" ? "bg-primary/5 ring-1 ring-primary/20" : "bg-card",
    },
    {
      label: "Permanent",
      value: stats.permanent,
      color: "text-pink-700",
      filter: "Permanent" as EmploymentFilter,
      bg: employmentFilter === "Permanent" ? "bg-pink-500/10 ring-1 ring-pink-500/30" : "bg-card",
    },
    {
      label: "Temporary",
      value: stats.temporary,
      color: "text-amber-600",
      filter: "Temporary" as EmploymentFilter,
      bg: employmentFilter === "Temporary" ? "bg-amber-500/10 ring-1 ring-amber-500/30" : "bg-card",
    },
  ];

  const employmentTypeBadge = (type: string) =>
    type === "Permanent"
      ? "bg-pink-500/10 text-pink-700"
      : "bg-amber-500/10 text-amber-700";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Staff Management</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Manage permanent and temporary team members</p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 shrink-0 bg-pink-700 hover:bg-pink-800 text-white font-semibold"
        >
          <Plus className="h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {/* Stat cards — desktop/tablet */}
      <div className="hidden sm:grid grid-cols-3 gap-2 sm:gap-3">
        {statCards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => setEmploymentFilter(card.filter)}
            className={`rounded-lg shadow-sm border border-border p-3 sm:p-4 text-left transition-all cursor-pointer hover:shadow-md ${card.bg} ${
              employmentFilter === card.filter ? "shadow-md" : ""
            }`}
          >
            <p className="text-[11px] sm:text-xs text-muted-foreground font-medium leading-tight">{card.label}</p>
            <div className={`text-xl sm:text-2xl font-bold mt-1 ${card.color}`}>{card.value}</div>
          </button>
        ))}
      </div>

      {/* Search + filter tabs */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, role, phone, email, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(employmentFilterLabels) as EmploymentFilter[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setEmploymentFilter(key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                employmentFilter === key
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-muted/50 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {key !== "all" && <Filter className="h-3 w-3" />}
              {employmentFilterLabels[key]}
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  employmentFilter === key ? "bg-white/20" : "bg-border"
                }`}
              >
                {employmentCounts[key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="px-4 sm:px-6 py-3 border-b border-border flex items-center justify-between gap-2">
          <p className="text-xs sm:text-sm text-muted-foreground min-w-0 truncate">
            {isLoading ? (
              "Loading..."
            ) : total === 0 ? (
              "No staff found"
            ) : (
              <>
                Showing <span className="font-medium text-foreground">{startItem}–{endItem}</span> of{" "}
                <span className="font-medium text-foreground">{total}</span> staff
                {employmentFilter !== "all" && (
                  <span className="hidden sm:inline ml-1">
                    — filtered by{" "}
                    <span className="text-primary font-medium">{employmentFilterLabels[employmentFilter]}</span>
                  </span>
                )}
              </>
            )}
          </p>
          {employmentFilter !== "all" && (
            <button
              type="button"
              onClick={() => setEmploymentFilter("all")}
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline shrink-0"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="hidden md:block">
          <ReusableTable
            data={staffList}
            columns={columns}
            isLoading={isLoading}
            emptyMessage={
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <p className="text-sm">No staff found</p>
                {employmentFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setEmploymentFilter("all")}
                    className="mt-2 text-xs text-primary hover:underline"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            }
            rowKey={(s) => s.id ?? s.staffNo}
            rowNumberStart={startItem || 1}
            onRowClick={(s) => s.id && navigate(`/staff/${s.id}`)}
          />
        </div>

        <div className="md:hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <span className="text-sm">Loading staff...</span>
            </div>
          ) : staffList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p className="text-sm">No staff found</p>
              {employmentFilter !== "all" && (
                <button
                  type="button"
                  onClick={() => setEmploymentFilter("all")}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {staffList.map((s, index) => {
                const statusLabel = getStaffStatusLabel(s);
                return (
                  <div
                    key={s.id ?? s.staffNo}
                    className={`px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer ${
                      !s.isActive ? "opacity-75" : ""
                    }`}
                    onClick={() => s.id && navigate(`/staff/${s.id}`)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="h-10 w-10 rounded-full bg-pink-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
                          {s.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground text-sm leading-tight truncate">
                            {s.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {s.staffNo} · {getStaffDisplayRole(s)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 shrink-0">
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="text-[10px] font-bold text-muted-foreground tabular-nums">
                            #{(startItem || 1) + index}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${employmentTypeBadge(s.employmentType)}`}
                          >
                            {s.employmentType}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${statusColor(statusLabel)}`}
                          >
                            {statusLabel}
                          </span>
                        </div>
                        {renderStaffActions(s)}
                      </div>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 pl-[52px]">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3 shrink-0" />
                        {s.phone}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground truncate max-w-[200px]">
                        <Mail className="h-3 w-3 shrink-0" />
                        {s.email}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {s.city}
                      </span>
                    </div>
                  </div>
                );
              })}
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
              <div className="hidden xs:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 5) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .reduce<(number | "...")[]>((acc, page, idx, arr) => {
                    if (
                      idx > 0 &&
                      typeof arr[idx - 1] === "number" &&
                      (page as number) - (arr[idx - 1] as number) > 1
                    ) {
                      acc.push("...");
                    }
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground text-sm">
                        …
                      </span>
                    ) : (
                      <Button
                        key={item}
                        variant={currentPage === item ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(item as number)}
                        className="h-8 w-8 p-0 text-xs"
                      >
                        {item}
                      </Button>
                    )
                  )}
              </div>
              <span className="xs:hidden text-sm text-muted-foreground px-2">
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

      <StaffFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => {
          fetchStaff(currentPage, debouncedSearch, employmentFilter);
          fetchStats();
        }}
        staff={null}
      />
      <StaffFormModal
        isOpen={!!editStaff}
        onClose={() => setEditStaff(null)}
        onSuccess={() => {
          fetchStaff(currentPage, debouncedSearch, employmentFilter);
          fetchStats();
        }}
        staff={editStaff}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete staff member?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
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
