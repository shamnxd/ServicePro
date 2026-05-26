import { useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export interface RemarkItem {
  id?: string;
  user: string;
  date: string;
  text: string;
}

interface RemarksPanelProps {
  remarks: RemarkItem[];
  newRemark: string;
  onNewRemarkChange: (value: string) => void;
  onAddRemark: () => void;
  onEditRemark?: (remarkKey: string, text: string) => void | Promise<void>;
  isSubmitting?: boolean;
  isEditingRemark?: boolean;
  disabled?: boolean;
  emptyMessage?: string;
  placeholder?: string;
  addButtonLabel?: string;
  sectionTitle?: string;
}

export function remarkKey(remark: RemarkItem, index: number): string {
  return remark.id ?? String(index);
}

function sortedRemarks(remarks: RemarkItem[]): { remark: RemarkItem; key: string; index: number }[] {
  return remarks
    .map((remark, index) => ({ remark, key: remarkKey(remark, index), index }))
    .sort((a, b) => new Date(b.remark.date).getTime() - new Date(a.remark.date).getTime());
}

export function RemarksPanel({
  remarks,
  newRemark,
  onNewRemarkChange,
  onAddRemark,
  onEditRemark,
  isSubmitting = false,
  isEditingRemark = false,
  disabled = false,
  emptyMessage = "No remarks yet.",
  placeholder = "Add a remark…",
  addButtonLabel = "Add",
  sectionTitle = "Add remark",
}: RemarksPanelProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const ordered = sortedRemarks(remarks);
  const canAdd = !disabled && newRemark.trim().length > 0 && !isSubmitting;
  const canEdit = Boolean(onEditRemark) && !disabled;

  const startEdit = (key: string, text: string) => {
    setEditingKey(key);
    setEditDraft(text);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditDraft("");
  };

  const saveEdit = async () => {
    if (!editingKey || !editDraft.trim() || !onEditRemark) return;
    await onEditRemark(editingKey, editDraft.trim());
    cancelEdit();
  };

  return (
    <div className="space-y-6">
      {ordered.length > 0 ? (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {ordered.map(({ remark, key }) => (
            <li key={key} className="px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <span className="text-sm font-medium text-foreground">{remark.user}</span>
                <div className="flex items-center gap-2">
                  <time className="text-sm text-muted-foreground">
                    {new Date(remark.date).toLocaleString()}
                  </time>
                  {canEdit && editingKey !== key && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => startEdit(key, remark.text)}
                      disabled={isEditingRemark || isSubmitting}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              {editingKey === key ? (
                <div className="space-y-3 max-w-xl">
                  <Textarea
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    rows={4}
                    disabled={isEditingRemark}
                    className="resize-none text-[15px] min-h-[100px] bg-background w-full"
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={cancelEdit} disabled={isEditingRemark}>
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={saveEdit}
                      disabled={!editDraft.trim() || isEditingRemark}
                      className="bg-pink-700 hover:bg-pink-800 text-white"
                    >
                      {isEditingRemark && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-[15px] text-foreground leading-relaxed whitespace-pre-wrap">{remark.text}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">
          {emptyMessage}
        </p>
      )}

      <div className="w-full max-w-xl space-y-3">
        <p className="text-sm font-medium text-foreground">{sectionTitle}</p>
        <Textarea
          placeholder={placeholder}
          value={newRemark}
          onChange={(e) => onNewRemarkChange(e.target.value)}
          rows={4}
          disabled={disabled || isSubmitting}
          className="resize-none text-[15px] min-h-[100px] bg-background w-full"
        />
        <div className="flex justify-end">
          <Button
            onClick={onAddRemark}
            disabled={!canAdd}
            size="sm"
            className="bg-pink-700 hover:bg-pink-800 text-white font-medium px-4"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {addButtonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
