import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { AmcContract } from "../interfaces/amc.interface";
import { scheduleAmcVisitApi, updateAmcVisitApi } from "../api/amc.api";
import { calculateNextPreferredVisitDate, formatContractDate } from "../utils/calculateAmcVisits";
import { StaffSelectDropdown } from "./StaffSelectDropdown";
import type { AmcVisit } from "../interfaces/amc.interface";

interface AmcScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contract: AmcContract | null;
  /** When set, updates an existing visit (reassign staff / reschedule). */
  visit?: AmcVisit | null;
}

const inputClass =
  "border border-input bg-background text-foreground [color-scheme:light] dark:[color-scheme:dark]";

function toDateInput(value?: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

export function AmcScheduleVisitModal({
  isOpen,
  onClose,
  onSuccess,
  contract,
  visit = null,
}: AmcScheduleVisitModalProps) {
  const [scheduledDate, setScheduledDate] = useState("");
  const [notes, setNotes] = useState("");
  const [assignedStaffIds, setAssignedStaffIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!visit?.id;

  useEffect(() => {
    if (!isOpen || !contract) return;
    if (visit) {
      setScheduledDate(toDateInput(visit.scheduledDate));
      setNotes(visit.notes ?? "");
      setAssignedStaffIds(visit.assignedStaffIds ?? []);
    } else {
      const preferred = calculateNextPreferredVisitDate(
        contract.startDate,
        contract.endDate,
        contract.visitsCompleted,
        contract.totalVisits
      );
      const defaultDate =
        toDateInput(contract.nextVisit) ||
        toDateInput(preferred) ||
        toDateInput(contract.startDate) ||
        "";
      setScheduledDate(defaultDate);
      setNotes("");
      setAssignedStaffIds([]);
    }
  }, [isOpen, contract, visit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract?.id) return;
    if (!scheduledDate) {
      toast.error("Please select a visit date");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEdit && visit?.id) {
        const res = await updateAmcVisitApi(contract.id, visit.id, {
          scheduledDate,
          notes: notes.trim() || undefined,
          assignedStaffIds,
        });
        if (res.success) {
          toast.success("Visit updated successfully");
          onSuccess();
          setTimeout(() => onClose(), 0);
        }
      } else {
        const res = await scheduleAmcVisitApi(contract.id, {
          scheduledDate,
          notes: notes.trim() || undefined,
          assignedStaffIds,
        });
        if (res.success) {
          toast.success("Visit scheduled successfully");
          onSuccess();
          setTimeout(() => onClose(), 0);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to schedule visit");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!contract) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md rounded-xl sm:rounded-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Update AMC Visit" : "Schedule AMC Visit"}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-2">
          {contract.amcNo} · {contract.clientName}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visit-date">Visit Date *</Label>
            <Input
              id="visit-date"
              type="date"
              value={scheduledDate}
              min={toDateInput(contract.startDate)}
              max={toDateInput(contract.endDate)}
              onChange={(e) => setScheduledDate(e.target.value)}
              className={inputClass}
              required
            />
            {scheduledDate && (
              <p className="text-xs text-muted-foreground">{formatContractDate(scheduledDate)}</p>
            )}
          </div>
          <StaffSelectDropdown
            selected={assignedStaffIds}
            onChange={setAssignedStaffIds}
            label="Assign Staff"
            placement="top"
          />

          <div className="space-y-2">
            <Label htmlFor="visit-notes">Notes</Label>
            <Textarea
              id="visit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional visit notes..."
              className={`${inputClass} min-h-[72px]`}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-pink-700 hover:bg-pink-800 text-white"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEdit ? "Save Changes" : "Schedule Visit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
