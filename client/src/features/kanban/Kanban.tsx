import { useState } from "react";
import { Plus, MoreVertical, Calendar, User, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";

type Task = {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  assignee: string;
  dueDate: string;
  type: string;
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
};

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    color: "bg-muted",
    tasks: [
      {
        id: "1",
        title: "Site Visit - ABC Corp",
        description: "Initial site inspection for HVAC installation",
        priority: "High",
        assignee: "Rajesh Kumar",
        dueDate: "2026-05-20",
        type: "Enquiry",
      },
      {
        id: "2",
        title: "Quotation - XYZ Industries",
        description: "Prepare quotation for fire safety system",
        priority: "Medium",
        assignee: "Amit Sharma",
        dueDate: "2026-05-22",
        type: "Quotation",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "bg-blue-500/10",
    tasks: [
      {
        id: "3",
        title: "AC Repair - DEF Solutions",
        description: "AC not cooling properly - troubleshooting",
        priority: "Critical",
        assignee: "Priya Patel",
        dueDate: "2026-05-18",
        type: "Complaint",
      },
      {
        id: "4",
        title: "AMC Visit - GHI Enterprises",
        description: "Quarterly maintenance scheduled",
        priority: "Medium",
        assignee: "Vikram Singh",
        dueDate: "2026-05-19",
        type: "AMC",
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    color: "bg-amber-500/10",
    tasks: [
      {
        id: "5",
        title: "Generator Installation",
        description: "Installation complete, pending client approval",
        priority: "Medium",
        assignee: "Rajesh Kumar",
        dueDate: "2026-05-17",
        type: "Project",
      },
    ],
  },
  {
    id: "completed",
    title: "Completed",
    color: "bg-green-500/10",
    tasks: [
      {
        id: "6",
        title: "Electrical Panel Upgrade",
        description: "Successfully completed and tested",
        priority: "Low",
        assignee: "Amit Sharma",
        dueDate: "2026-05-15",
        type: "Project",
      },
      {
        id: "7",
        title: "Fire Alarm Maintenance",
        description: "Routine maintenance completed",
        priority: "Low",
        assignee: "Priya Patel",
        dueDate: "2026-05-16",
        type: "AMC",
      },
    ],
  },
];

export function Kanban() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "High":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Enquiry":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Quotation":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "Complaint":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "AMC":
        return "bg-teal-500/10 text-teal-500 border-teal-500/20";
      case "Project":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const filteredColumns = columns.map((column) => ({
    ...column,
    tasks: column.tasks.filter((task) => {
      const matchesType = typeFilter === "all" || task.type === typeFilter;
      const matchesAssignee = assigneeFilter === "all" || task.assignee === assigneeFilter;
      return matchesType && matchesAssignee;
    }),
  }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Kanban Board</h2>
          <p className="text-muted-foreground mt-1">Manage tasks and workflow</p>
        </div>
        <div className="flex gap-3">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-3 block">Filter by Type</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setTypeFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeFilter === "all"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter("Enquiry")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeFilter === "Enquiry"
                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                    : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                }`}
              >
                Enquiry
              </button>
              <button
                onClick={() => setTypeFilter("Quotation")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeFilter === "Quotation"
                    ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                    : "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20"
                }`}
              >
                Quotation
              </button>
              <button
                onClick={() => setTypeFilter("Complaint")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeFilter === "Complaint"
                    ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                    : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                }`}
              >
                Complaint
              </button>
              <button
                onClick={() => setTypeFilter("AMC")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeFilter === "AMC"
                    ? "bg-teal-500 text-white shadow-md shadow-teal-500/20"
                    : "bg-teal-500/10 text-teal-500 hover:bg-teal-500/20"
                }`}
              >
                AMC
              </button>
              <button
                onClick={() => setTypeFilter("Project")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeFilter === "Project"
                    ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                    : "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20"
                }`}
              >
                Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredColumns.map((column) => (
          <div key={column.id} className="flex flex-col min-h-[500px]">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${column.color.replace("/10", "").replace("bg-", "bg-")}`}></div>
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">{column.title}</h3>
                <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                  {column.tasks.length}
                </span>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            {/* Tasks Container */}
            <div className="space-y-3 flex-1 bg-muted/20 rounded-2xl p-2 border border-border/50">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-card rounded-xl border border-border p-3.5 hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]"
                >
                  {/* Task Header */}
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-foreground text-sm flex-1 leading-snug group-hover:text-primary transition-colors">
                      {task.title}
                    </h4>
                    <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>

                  {/* Tags */}
                  <div className="flex gap-1.5 mb-4 flex-wrap">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border uppercase tracking-wider ${getTypeColor(task.type)}`}>
                      {task.type}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full overflow-hidden shrink-0 border border-border shadow-sm">
                        <img 
                          src={`https://i.pravatar.cc/150?u=${encodeURIComponent(task.assignee)}`} 
                          alt={task.assignee} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {task.assignee.split(" ")[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <Calendar className="h-3 w-3 opacity-50" />
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Task Button */}
              <button className="w-full py-3 border-2 border-dashed border-border/50 rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-card/50 transition-all text-xs font-bold uppercase tracking-widest">
                + Add Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
