import { useState } from "react";
import { FileText, Download, TrendingUp, DollarSign, Users, Calendar } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const monthlyRevenueData = [
  { month: "Jan", revenue: 850000, target: 900000 },
  { month: "Feb", revenue: 920000, target: 900000 },
  { month: "Mar", revenue: 1050000, target: 1000000 },
  { month: "Apr", revenue: 1180000, target: 1100000 },
  { month: "May", revenue: 1250000, target: 1200000 },
];

const complaintTrendData = [
  { month: "Jan", registered: 35, resolved: 32 },
  { month: "Feb", registered: 28, resolved: 30 },
  { month: "Mar", registered: 42, resolved: 38 },
  { month: "Apr", registered: 38, resolved: 40 },
  { month: "May", registered: 31, resolved: 29 },
];

const amcRevenueData = [
  { client: "ABC Corp", revenue: 120000 },
  { client: "XYZ Ind", revenue: 240000 },
  { client: "DEF Sol", revenue: 150000 },
  { client: "GHI Ent", revenue: 80000 },
  { client: "JKL Ltd", revenue: 180000 },
];

const recentReports = [
  {
    id: 1,
    name: "Monthly Revenue Report - May 2026",
    type: "Revenue",
    date: "2026-05-16",
    status: "Generated",
  },
  {
    id: 2,
    name: "AMC Contract Summary - Q1 2026",
    type: "AMC",
    date: "2026-04-01",
    status: "Generated",
  },
  {
    id: 3,
    name: "Complaint Resolution Report - Apr 2026",
    type: "Complaints",
    date: "2026-05-01",
    status: "Generated",
  },
  {
    id: 4,
    name: "Invoice Status Report - May 2026",
    type: "Invoices",
    date: "2026-05-15",
    status: "Generated",
  },
];

export function Reports() {
  const [selectedMonth, setSelectedMonth] = useState("may");
  const [selectedReportType, setSelectedReportType] = useState("revenue");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">Generate business reports and insights</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-pink-700 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold mt-1">₹52.5L</p>
              <p className="text-pink-100 text-xs mt-2">This Year</p>
            </div>
            <DollarSign className="h-12 w-12 text-pink-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Active Clients</p>
              <p className="text-3xl font-bold mt-1">89</p>
              <p className="text-pink-100 text-xs mt-2">+7% from last month</p>
            </div>
            <Users className="h-12 w-12 text-pink-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-700 to-pink-800 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Active AMC</p>
              <p className="text-3xl font-bold mt-1">68</p>
              <p className="text-pink-100 text-xs mt-2">Contract Value: ₹77L</p>
            </div>
            <Calendar className="h-12 w-12 text-pink-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Growth Rate</p>
              <p className="text-3xl font-bold mt-1">+18%</p>
              <p className="text-pink-100 text-xs mt-2">Month over Month</p>
            </div>
            <TrendingUp className="h-12 w-12 text-pink-200" />
          </div>
        </div>
      </div>

      {/* Report Generator */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Report</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedReportType} onValueChange={setSelectedReportType}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue Report</SelectItem>
              <SelectItem value="amc">AMC Summary</SelectItem>
              <SelectItem value="complaints">Complaint Report</SelectItem>
              <SelectItem value="invoices">Invoice Status</SelectItem>
              <SelectItem value="expenses">Expense Report</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="may">May 2026</SelectItem>
              <SelectItem value="apr">April 2026</SelectItem>
              <SelectItem value="mar">March 2026</SelectItem>
              <SelectItem value="q1">Q1 2026</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>

          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate PDF
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="complaints">Complaint Trends</TabsTrigger>
          <TabsTrigger value="amc">AMC Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-6">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Monthly Revenue vs Target
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Line
                  key="revenue-line"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#be185d"
                  strokeWidth={3}
                  name="Actual Revenue"
                  dot={{ fill: "#be185d", r: 5 }}
                />
                <Line
                  key="target-line"
                  type="monotone"
                  dataKey="target"
                  stroke="#9f1239"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target"
                  dot={{ fill: "#9f1239", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="complaints" className="mt-6">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Complaint Registration vs Resolution Trends
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={complaintTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar key="registered-bar" dataKey="registered" fill="#f59e0b" name="Registered" radius={[8, 8, 0, 0]} />
                <Bar key="resolved-bar" dataKey="resolved" fill="#be185d" name="Resolved" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="amc" className="mt-6">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              AMC Revenue by Client (Top 5)
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={amcRevenueData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="client" type="category" width={100} stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar key="amc-revenue-bar" dataKey="revenue" fill="#be185d" name="AMC Revenue (₹)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Reports */}
      <div className="bg-card rounded-2xl shadow-sm border border-border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recently Generated Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {report.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(report.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
