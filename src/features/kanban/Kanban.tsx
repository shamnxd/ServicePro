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
    color: "bg-gray-100",
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
    color: "bg-blue-100",
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
    color: "bg-yellow-100",
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
    color: "bg-green-100",
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
        return "bg-red-100 text-red-800 border-red-300";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Enquiry":
        return "bg-blue-100 text-blue-800";
      case "Quotation":
        return "bg-purple-100 text-purple-800";
      case "Complaint":
        return "bg-red-100 text-red-800";
      case "AMC":
        return "bg-teal-100 text-teal-800";
      case "Project":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
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
            <label className="text-sm font-medium text-foreground mb-2 block">Filter by Type</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setTypeFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === "all"
                    ? "bg-pink-700 text-white shadow-md shadow-pink-200"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter("Enquiry")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === "Enquiry"
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
              >
                Enquiry
              </button>
              <button
                onClick={() => setTypeFilter("Quotation")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === "Quotation"
                    ? "bg-purple-500 text-white"
                    : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                }`}
              >
                Quotation
              </button>
              <button
                onClick={() => setTypeFilter("Complaint")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === "Complaint"
                    ? "bg-red-500 text-white"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                Complaint
              </button>
              <button
                onClick={() => setTypeFilter("AMC")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === "AMC"
                    ? "bg-teal-500 text-white"
                    : "bg-teal-100 text-teal-800 hover:bg-teal-200"
                }`}
              >
                AMC
              </button>
              <button
                onClick={() => setTypeFilter("Project")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === "Project"
                    ? "bg-indigo-500 text-white"
                    : "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                }`}
              >
                Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredColumns.map((column) => (
          <div key={column.id} className="flex flex-col">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color.replace("bg-", "bg-opacity-50 bg-")}`}></div>
                <h3 className="font-semibold text-foreground">{column.title}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            {/* Tasks */}
            <div className="space-y-3 flex-1">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-card rounded-xl border border-border p-3.5 hover:shadow transition-all cursor-pointer"
                >
                  {/* Task Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-foreground text-sm flex-1">
                      {task.title}
                    </h4>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {task.description}
                  </p>

                  {/* Tags */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getTypeColor(task.type)}`}>
                      {task.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full overflow-hidden shrink-0 border border-primary/20 shadow-sm">
                        <img 
                          src={`https://i.pravatar.cc/150?u=${encodeURIComponent(task.assignee)}`} 
                          alt={task.assignee} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {task.assignee.split(" ")[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Task Button */}
              <button className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium">
                + Add Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
