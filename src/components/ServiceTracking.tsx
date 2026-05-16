import { useState } from "react";
import { Clock, Car, Package, DollarSign, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface ServiceLog {
  id: number;
  date: string;
  travelTime: number; // in minutes
  workTime: number; // in minutes
  petrolExpense: number;
  otherExpenses: number;
  materials: { name: string; quantity: number; cost: number }[];
  remarks: string;
  technician: string;
}

interface ServiceTrackingProps {
  serviceType: "AMC" | "Complaint";
  serviceNo: string;
  logs?: ServiceLog[];
}

export function ServiceTracking({ serviceType, serviceNo, logs = [] }: ServiceTrackingProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [materialsList, setMaterialsList] = useState([{ name: "", quantity: 0, cost: 0 }]);

  const totalTravelTime = logs.reduce((sum, log) => sum + log.travelTime, 0);
  const totalWorkTime = logs.reduce((sum, log) => sum + log.workTime, 0);
  const totalPetrol = logs.reduce((sum, log) => sum + log.petrolExpense, 0);
  const totalExpenses = logs.reduce((sum, log) => sum + log.otherExpenses, 0);
  const totalMaterialCost = logs.reduce(
    (sum, log) => sum + log.materials.reduce((s, m) => s + m.cost, 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-foreground">Service Tracking</h4>
        <Button
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Entry
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
          <div className="flex items-center gap-2 text-blue-500 mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">Travel Time</span>
          </div>
          <p className="text-lg font-bold text-foreground">{totalTravelTime} min</p>
        </div>
        <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
          <div className="flex items-center gap-2 text-green-500 mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">Work Time</span>
          </div>
          <p className="text-lg font-bold text-foreground">{totalWorkTime} min</p>
        </div>
        <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
          <div className="flex items-center gap-2 text-orange-500 mb-1">
            <Car className="h-4 w-4" />
            <span className="text-xs font-medium">Petrol</span>
          </div>
          <p className="text-lg font-bold text-foreground">₹{totalPetrol}</p>
        </div>
        <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-500 mb-1">
            <Package className="h-4 w-4" />
            <span className="text-xs font-medium">Materials</span>
          </div>
          <p className="text-lg font-bold text-foreground">₹{totalMaterialCost}</p>
        </div>
        <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
          <div className="flex items-center gap-2 text-red-500 mb-1">
            <DollarSign className="h-4 w-4" />
            <span className="text-xs font-medium">Other Exp.</span>
          </div>
          <p className="text-lg font-bold text-foreground">₹{totalExpenses}</p>
        </div>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <div className="border border-border rounded-lg p-4 bg-muted/30">
          <h5 className="font-medium text-foreground mb-3">Add Service Entry</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entryDate">Date *</Label>
              <Input id="entryDate" type="date" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="technician">Technician *</Label>
              <Input id="technician" placeholder="Technician name" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="travelTime">Travel Time (minutes) *</Label>
              <Input id="travelTime" type="number" placeholder="0" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="workTime">Work Time (minutes) *</Label>
              <Input id="workTime" type="number" placeholder="0" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="petrolExpense">Petrol Expense (₹)</Label>
              <Input id="petrolExpense" type="number" placeholder="0" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="otherExpenses">Other Expenses (₹)</Label>
              <Input id="otherExpenses" type="number" placeholder="0" className="mt-1" />
            </div>
          </div>

          {/* Materials */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Materials Used</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMaterialsList([...materialsList, { name: "", quantity: 0, cost: 0 }])}
              >
                Add Material
              </Button>
            </div>
            <div className="space-y-2">
              {materialsList.map((material, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2">
                  <div className="col-span-6">
                    <Input placeholder="Material name" />
                  </div>
                  <div className="col-span-2">
                    <Input type="number" placeholder="Qty" />
                  </div>
                  <div className="col-span-3">
                    <Input type="number" placeholder="Cost" />
                  </div>
                  <div className="col-span-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setMaterialsList(materialsList.filter((_, i) => i !== idx))}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div className="mt-4">
            <Label htmlFor="entryRemarks">Remarks</Label>
            <Textarea id="entryRemarks" placeholder="Add remarks..." className="mt-1" rows={2} />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button size="sm">Save Entry</Button>
          </div>
        </div>
      )}

      {/* Service Logs */}
      {logs.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Technician</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground uppercase">Travel (min)</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground uppercase">Work (min)</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase">Petrol (₹)</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase">Materials (₹)</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase">Other (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-2 text-foreground">{new Date(log.date).toLocaleDateString()}</td>
                  <td className="px-3 py-2 text-foreground">{log.technician}</td>
                  <td className="px-3 py-2 text-center text-muted-foreground">{log.travelTime}</td>
                  <td className="px-3 py-2 text-center text-muted-foreground">{log.workTime}</td>
                  <td className="px-3 py-2 text-right text-muted-foreground">₹{log.petrolExpense}</td>
                  <td className="px-3 py-2 text-right text-muted-foreground">
                    ₹{log.materials.reduce((s, m) => s + m.cost, 0)}
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground">₹{log.otherExpenses}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted">
              <tr className="font-bold">
                <td colSpan={2} className="px-3 py-2 text-foreground">Total</td>
                <td className="px-3 py-2 text-center text-foreground">{totalTravelTime}</td>
                <td className="px-3 py-2 text-center text-foreground">{totalWorkTime}</td>
                <td className="px-3 py-2 text-right text-foreground">₹{totalPetrol}</td>
                <td className="px-3 py-2 text-right text-foreground">₹{totalMaterialCost}</td>
                <td className="px-3 py-2 text-right text-foreground">₹{totalExpenses}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {logs.length === 0 && !showAddForm && (
        <p className="text-sm text-muted-foreground italic text-center py-4">No service entries yet</p>
      )}
    </div>
  );
}
