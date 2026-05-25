import React from "react";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export interface Column<T> {
  header: React.ReactNode;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface ReusableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: React.ReactNode;
  onRowClick?: (row: T) => void;
  rowKey?: (row: T) => string | number;
  /** First row number (use with pagination: (page - 1) * pageSize + 1) */
  rowNumberStart?: number;
  showRowNumber?: boolean;
}

function defaultRowKey<T>(row: T, index: number): string | number {
  const r = row as Record<string, unknown>;
  const id = r.id ?? r._id;
  if (id != null) return String(id);
  return index;
}

const rowNumberHeadClass = "w-12 sm:w-14 text-center text-xs font-bold text-muted-foreground";
const rowNumberCellClass = "w-12 sm:w-14 text-center text-sm text-muted-foreground tabular-nums";

export function ReusableTable<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "No records found",
  onRowClick,
  rowKey,
  rowNumberStart = 1,
  showRowNumber = true,
}: ReusableTableProps<T>) {
  const colCount = columns.length + (showRowNumber ? 1 : 0);

  return (
    <div className="relative w-full overflow-x-auto">
      <Table className="w-full min-w-max table-auto">
        <TableHeader className="bg-muted/50 border-b border-border">
          <TableRow>
            {showRowNumber && (
              <TableHead className={rowNumberHeadClass}>No.</TableHead>
            )}
            {columns.map((column, idx) => (
              <TableHead key={idx} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border">
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={colCount} className="h-32 text-center align-middle">
                <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="text-sm">Loading data...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colCount} className="h-32 text-center align-middle text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={rowKey ? rowKey(row) : defaultRowKey(row, index)}
                onClick={(e) => {
                  if (!onRowClick) return;
                  const target = e.target as HTMLElement;
                  if (
                    target.closest(
                      "button, a, input, select, textarea, [role='menuitem'], [data-slot='dropdown-menu-trigger'], [data-slot='dropdown-menu-content']"
                    )
                  ) {
                    return;
                  }
                  onRowClick(row);
                }}
                className={`hover:bg-muted/30 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {showRowNumber && (
                  <TableCell className={rowNumberCellClass}>
                    {rowNumberStart + index}
                  </TableCell>
                )}
                {columns.map((column, idx) => {
                  let cellContent: React.ReactNode = "";
                  if (column.accessor) {
                    if (typeof column.accessor === "function") {
                      cellContent = column.accessor(row);
                    } else {
                      cellContent = row[column.accessor] as React.ReactNode;
                    }
                  }
                  return (
                    <TableCell key={idx} className={column.className}>
                      {cellContent}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
