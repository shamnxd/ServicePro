import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, Calendar, DollarSign } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";

const mockAMCPlans = [
  {
    id: 1,
    planName: "Basic HVAC Maintenance",
    category: "HVAC",
    frequency: "Quarterly",
    visits: 4,
    amount: 120000,
    duration: "12 months",
    inclusions: ["Filter cleaning", "Gas pressure check", "General inspection"],
    active: true,
  },
  {
    id: 2,
    planName: "Premium Fire Safety",
    category: "Fire Safety",
    frequency: "Monthly",
    visits: 12,
    amount: 240000,
    duration: "12 months",
    inclusions: ["Sensor testing", "Alarm testing", "Sprinkler inspection", "Battery check"],
    active: true,
  },
  {
    id: 3,
    planName: "Standard Electrical",
    category: "Electrical",
    frequency: "Bi-Annual",
    visits: 2,
    amount: 80000,
    duration: "12 months",
    inclusions: ["Panel inspection", "Connection check", "Load testing"],
    active: true,
  },
  {
    id: 4,
    planName: "Generator Maintenance",
    category: "Generator",
    frequency: "Quarterly",
    visits: 4,
    amount: 150000,
    duration: "12 months",
    inclusions: ["Oil change", "Filter replacement", "Battery check", "Load test"],
    active: false,
  },
];

export function AMCPlans() {
  const [searchQuery, setSearchQuery] = useState("");
  const [plans] = useState(mockAMCPlans);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof mockAMCPlans[0] | null>(null);

  const filteredPlans = plans.filter((plan) =>
    plan.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AMC Plans</h2>
          <p className="text-muted-foreground mt-1">Create and manage AMC packages</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New AMC Plan</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="planName">Plan Name *</Label>
                  <Input id="planName" placeholder="e.g., Premium HVAC" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="fire">Fire Safety</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="generator">Generator</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="frequency">Visit Frequency *</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="biannual">Bi-Annual</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="visits">Number of Visits *</Label>
                  <Input id="visits" type="number" placeholder="4" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="amount">Plan Amount (₹) *</Label>
                  <Input id="amount" type="number" placeholder="120000" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="duration">Plan Duration *</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="inclusions">Plan Inclusions *</Label>
                  <Textarea
                    id="inclusions"
                    placeholder="Enter inclusions (one per line)"
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Plan</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search plans by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Plans</p>
          <p className="text-2xl font-bold text-foreground mt-1">{plans.length}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Active Plans</p>
          <p className="text-2xl font-bold text-green-500 mt-1">
            {plans.filter((p) => p.active).length}
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">
            ₹{(plans.reduce((sum, p) => sum + p.amount, 0) / 100000).toFixed(1)}L
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Categories</p>
          <p className="text-2xl font-bold text-purple-500 mt-1">
            {new Set(plans.map((p) => p.category)).size}
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPlans.map((plan) => (
          <div key={plan.id} className="bg-card rounded-lg shadow-sm hover:shadow transition-shadow border border-border flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 truncate">{plan.planName}</h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    {plan.category}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    plan.active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {plan.active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 opacity-50" />
                    Frequency
                  </span>
                  <span className="font-medium text-foreground">{plan.frequency}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Visits per Year</span>
                  <span className="font-medium text-foreground">{plan.visits}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium text-foreground">{plan.duration}</span>
                </div>
                <div className="pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4 opacity-50" />
                      Plan Amount
                    </span>
                    <span className="text-lg font-bold text-blue-500">₹{plan.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Inclusions</p>
                <ul className="space-y-1.5">
                  {plan.inclusions.slice(0, 3).map((inclusion, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-green-500 mt-0.5 font-bold">✓</span>
                      <span className="line-clamp-1">{inclusion}</span>
                    </li>
                  ))}
                  {plan.inclusions.length > 3 && (
                    <li className="text-xs text-blue-500 font-medium">+ {plan.inclusions.length - 3} more</li>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="p-4 pt-0 flex gap-2 border-t border-border/10">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8 text-xs"
                onClick={() => {
                  setSelectedPlan(plan);
                  setIsViewDialogOpen(true);
                }}
              >
                View
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                Edit
              </Button>
              <Button size="sm" variant="outline" className="w-8 h-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* View Plan Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AMC Plan Details</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Plan Name</label>
                  <p className="mt-1 text-foreground font-semibold text-lg">{selectedPlan.planName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p className="mt-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      {selectedPlan.category}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Frequency</label>
                  <p className="mt-1 text-foreground">{selectedPlan.frequency}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Visits</label>
                  <p className="mt-1 text-foreground">{selectedPlan.visits}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Duration</label>
                  <p className="mt-1 text-foreground">{selectedPlan.duration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Plan Amount</label>
                  <p className="mt-1 text-blue-500 font-bold text-xl">₹{selectedPlan.amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t border-border/50 pt-4">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Plan Inclusions</label>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedPlan.inclusions.map((inclusion, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-foreground bg-muted/30 p-2 rounded-lg border border-border/50">
                      <span className="text-green-500 font-bold">✓</span>
                      {inclusion}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Use This Plan</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
