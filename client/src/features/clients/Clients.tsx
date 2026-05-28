import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Plus, Edit, Trash2, Eye, MapPin, Phone, Mail, MoreVertical } from "lucide-react";
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
import { getClientsApi, deleteClientApi } from "../../api/client.api";
import { getComplaintsApi } from "../../api/complaint.api";
import { getEnquiriesApi } from "../../api/enquiry.api";
import { ClientFormModal } from "./ClientFormModal";
import { useDebounce } from "../../hooks/useDebounce";
import { ManagementListPage } from "../../components/ManagementListPage";

type FilterType = "all" | "active-amc" | "expired-amc" | "active-complaints" | "active-enquiries";

const PAGE_SIZE = 10;

export function Clients() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);

  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const [activeComplaintCompanies, setActiveComplaintCompanies] = useState<string[]>([]);
  const [activeEnquiryCompanies, setActiveEnquiryCompanies] = useState<string[]>([]);
  const [complaintCountsByClientId, setComplaintCountsByClientId] = useState<Record<string, number>>({});
  const [complaintCountsByCompanyName, setComplaintCountsByCompanyName] = useState<Record<string, number>>({});
  const [enquiryCountsByClientId, setEnquiryCountsByClientId] = useState<Record<string, number>>({});
  const [enquiryCountsByCompanyName, setEnquiryCountsByCompanyName] = useState<Record<string, number>>({});

  // Stat counts (fetched separately without pagination)
  const [statCounts, setStatCounts] = useState({
    total: 0,
    activeAmc: 0,
    expiredAmc: 0,
    activeComplaints: 0,
    activeEnquiries: 0,
  });

  const loadActiveComplaintData = useCallback(async (): Promise<number> => {
    try {
      const [pendingRes, inProgressRes] = await Promise.all([
        getComplaintsApi({ status: "Pending", page: 1, limit: 500 }),
        getComplaintsApi({ status: "In Progress", page: 1, limit: 500 }),
      ]);

      const active = [
        ...(pendingRes.success ? pendingRes.data : []),
        ...(inProgressRes.success ? inProgressRes.data : []),
      ];

      const byClientId: Record<string, number> = {};
      const byCompanyName: Record<string, number> = {};
      const companyNames = new Set<string>();

      for (const c of active) {
        if (c.clientId) {
          byClientId[c.clientId] = (byClientId[c.clientId] ?? 0) + 1;
        }
        const nameKey = c.clientName?.trim().toLowerCase();
        if (nameKey) {
          byCompanyName[nameKey] = (byCompanyName[nameKey] ?? 0) + 1;
          companyNames.add(c.clientName);
        }
      }

      setComplaintCountsByClientId(byClientId);
      setComplaintCountsByCompanyName(byCompanyName);
      setActiveComplaintCompanies([...companyNames]);
      return companyNames.size;
    } catch (err) {
      console.error("Failed to fetch active complaints:", err);
      setComplaintCountsByClientId({});
      setComplaintCountsByCompanyName({});
      setActiveComplaintCompanies([]);
      return 0;
    }
  }, []);

  const loadActiveEnquiryData = useCallback(async (): Promise<number> => {
    try {
      const statuses = ["Site Visit Scheduled", "Quotation Prepared", "Follow-up Required"] as const;
      const responses = await Promise.all(
        statuses.map((status) => getEnquiriesApi({ status, page: 1, limit: 500 })),
      );

      const byClientId: Record<string, number> = {};
      const byCompanyName: Record<string, number> = {};
      const companyNames = new Set<string>();

      for (const res of responses) {
        if (!res.success) continue;
        for (const e of res.data) {
          if (e.clientId) {
            byClientId[e.clientId] = (byClientId[e.clientId] ?? 0) + 1;
          }
          const nameKey = e.clientName?.trim().toLowerCase();
          if (nameKey) {
            byCompanyName[nameKey] = (byCompanyName[nameKey] ?? 0) + 1;
            companyNames.add(e.clientName);
          }
        }
      }

      setEnquiryCountsByClientId(byClientId);
      setEnquiryCountsByCompanyName(byCompanyName);
      setActiveEnquiryCompanies([...companyNames]);
      return companyNames.size;
    } catch (err) {
      console.error("Failed to fetch active enquiries:", err);
      setEnquiryCountsByClientId({});
      setEnquiryCountsByCompanyName({});
      setActiveEnquiryCompanies([]);
      return 0;
    }
  }, []);

  const fetchStatCounts = useCallback(async () => {
    try {
      const [allRes, activeAmcRes, expiredAmcRes, activeComplaintClientCount, activeEnquiryClientCount] =
        await Promise.all([
          getClientsApi({ page: 1, limit: 1 }),
          getClientsApi({ page: 1, limit: 1, filter: "active-amc" }),
          getClientsApi({ page: 1, limit: 1, filter: "expired-amc" }),
          loadActiveComplaintData(),
          loadActiveEnquiryData(),
        ]);
      setStatCounts({
        total: allRes.total ?? 0,
        activeAmc: activeAmcRes.total ?? 0,
        expiredAmc: expiredAmcRes.total ?? 0,
        activeComplaints: activeComplaintClientCount,
        activeEnquiries: activeEnquiryClientCount,
      });
    } catch (err) {
      console.error("Failed to fetch stat counts:", err);
    }
  }, [loadActiveComplaintData, loadActiveEnquiryData]);

  const fetchClients = useCallback(async (page: number, search: string, filter: FilterType) => {
    setIsLoading(true);
    try {
      const companyNames =
        filter === "active-complaints"
          ? activeComplaintCompanies
          : filter === "active-enquiries"
          ? activeEnquiryCompanies
          : undefined;

      const response = await getClientsApi({
        search: search || undefined,
        page,
        limit: PAGE_SIZE,
        filter: filter === "all" ? undefined : filter,
        companyNames,
      });

      if (response.success) {
        setClients(response.data);
        setTotal(response.total ?? 0);
        setTotalPages(response.totalPages ?? 0);
      }
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeComplaintCompanies, activeEnquiryCompanies]);

  // Re-fetch whenever debounced search, filter, or page changes
  useEffect(() => {
    fetchClients(currentPage, debouncedSearch, activeFilter);
  }, [currentPage, debouncedSearch, activeFilter, fetchClients]);

  // Reset to page 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeFilter]);

  useEffect(() => {
    fetchStatCounts();
  }, [fetchStatCounts]);

  const handleOpenAddDialog = () => {
    setSelectedClient(null);
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (client: Client) => {
    setSelectedClient(client);
    setIsAddDialogOpen(true);
  };

  const handleFormSuccess = () => {
    fetchClients(currentPage, debouncedSearch, activeFilter);
    fetchStatCounts();
  };

  const triggerDeleteClient = (id: string) => {
    setClientToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const executeDeleteClient = async () => {
    if (!clientToDelete) return;
    try {
      const response = await deleteClientApi(clientToDelete);
      if (response.success) {
        fetchClients(currentPage, debouncedSearch, activeFilter);
        fetchStatCounts();
      }
    } catch (error) {
      console.error("Failed to delete client:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const getActiveComplaintsCount = (client: Client) => {
    if (client.id && complaintCountsByClientId[client.id] != null) {
      return complaintCountsByClientId[client.id];
    }
    return complaintCountsByCompanyName[client.companyName.trim().toLowerCase()] ?? 0;
  };

  const getActiveEnquiriesCount = (client: Client) => {
    if (client.id && enquiryCountsByClientId[client.id] != null) {
      return enquiryCountsByClientId[client.id];
    }
    return enquiryCountsByCompanyName[client.companyName.trim().toLowerCase()] ?? 0;
  };

  const filterChips = [
    { value: "all" as FilterType, label: "All Clients", count: statCounts.total, tone: "primary" as const },
    { value: "active-amc" as FilterType, label: "Active AMC", count: statCounts.activeAmc, tone: "green" as const },
    { value: "expired-amc" as FilterType, label: "Expired AMC", count: statCounts.expiredAmc, tone: "red" as const },
    { value: "active-complaints" as FilterType, label: "Active Complaints", count: statCounts.activeComplaints, tone: "orange" as const },
    { value: "active-enquiries" as FilterType, label: "Active Enquiries", count: statCounts.activeEnquiries, tone: "blue" as const },
  ];

  const columns = [
    {
      header: "Company",
      accessor: (client: Client) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 border border-border shadow-sm">
            <img
              src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(client.companyName)}&backgroundColor=be185d&fontSize=40&fontWeight=700`}
              alt={client.companyName}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-foreground leading-tight">{client.companyName}</p>
            {client.gst && <p className="text-[10px] text-muted-foreground font-mono mt-0.5 uppercase">{client.gst}</p>}
          </div>
        </div>
      ),
      className: "px-6 py-4",
    },
    {
      header: "Contact Person",
      accessor: "contactPerson" as keyof Client,
      className: "px-6 py-4 text-sm text-foreground",
    },
    {
      header: "Contact Info",
      accessor: (client: Client) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            {client.phone}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            {client.email}
          </div>
        </div>
      ),
      className: "px-6 py-4",
    },
    {
      header: "Location",
      accessor: (client: Client) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {client.city}
        </div>
      ),
      className: "px-6 py-4",
    },
    {
      header: "Active Complaints",
      accessor: (client: Client) => {
        const count = getActiveComplaintsCount(client);
        return count > 0 ? (
          <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-orange-500/10 text-orange-500">
            {count}
          </span>
        ) : (
          <span className="text-muted-foreground">0</span>
        );
      },
      className: "px-6 py-4 text-sm",
    },
    {
      header: <span className="sr-only">Actions</span>,
      className: "px-6 py-4 text-right w-[60px]",
      accessor: (client: Client) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-muted rounded-full">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem
              onClick={() => navigate(`/clients/${client.id}`)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4 text-blue-500" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleOpenEditDialog(client)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4 text-green-500" />
              Edit Client
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => triggerDeleteClient(client.id!)}
              className="cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4 text-destructive" />
              Delete Client
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <ManagementListPage
        title="Client Management"
        subtitle="Manage your client database"
        headerAction={
          <Button
            onClick={handleOpenAddDialog}
            className="flex items-center gap-2 shrink-0 bg-pink-700 hover:bg-pink-800 text-white font-semibold"
          >
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        }
        searchPlaceholder="Search clients by name, contact, or city…"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filterOptions={filterChips}
        filterValue={activeFilter}
        onFilterChange={setActiveFilter}
        columns={columns}
        data={clients}
        isLoading={isLoading}
        rowKey={(client) => client.id || client.companyName}
        onRowClick={(client) => client.id && navigate(`/clients/${client.id}`)}
        emptyMessage="No clients found"
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        entityLabel="clients"
        activeFilterLabel={
          activeFilter !== "all"
            ? {
                "active-amc": "Active AMC",
                "expired-amc": "Expired AMC",
                "active-complaints": "Active Complaints",
                "active-enquiries": "Active Enquiries",
              }[activeFilter]
            : undefined
        }
        onClearFilter={() => setActiveFilter("all")}
      />

      <ClientFormModal
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleFormSuccess}
        client={selectedClient}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the client record from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setClientToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDeleteClient}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
