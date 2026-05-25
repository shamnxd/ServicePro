import { IStaffRepository } from "../interfaces/repositories/IStaffRepository";
import { IStaff } from "../interfaces/models/IStaff";

export function getStaffDisplayRole(staff: IStaff): string {
  return staff.role === "Custom" && staff.customRole ? staff.customRole : staff.role;
}

export async function resolveComplaintStaffAssignment(
  staffRepository: IStaffRepository,
  assignedStaffIds?: string[]
): Promise<{ assignedStaffIds: string[]; assignedTo: string[] }> {
  const ids = assignedStaffIds?.filter(Boolean) ?? [];
  if (ids.length === 0) {
    return { assignedStaffIds: [], assignedTo: [] };
  }

  const staffList = await staffRepository.findByIds(ids);
  const names = staffList.map((s) => s.fullName);
  return {
    assignedStaffIds: staffList.map((s) => s.id!),
    assignedTo: names
  };
}
