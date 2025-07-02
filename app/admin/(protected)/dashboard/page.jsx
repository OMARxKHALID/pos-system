"use client";

import { useState, useRef } from "react";
import {
  BarChart3,
  Package,
  Users,
  FileText,
  Calendar,
  Download,
  Search,
  Menu,
  PieChart,
  CreditCard,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { useAdminSidebarStore } from "@/hooks/use-admin-sidebar-store";
import { useAnalytics } from "@/hooks/use-analytics";

// Import refactored dashboard components
import DashboardCard from "@/components/dashboard/DashboardCard";
import ProductRow from "@/components/dashboard/ProductRow";
import StatusIndicator from "@/components/dashboard/StatusIndicator";
import ReportGraph from "@/components/dashboard/report-graph";
import FavoriteProductList from "@/components/dashboard/FavoriteProductList";
import OrdersTable from "@/components/dashboard/OrdersTable";

function exportAnalyticsCSV(data, linkRef) {
  if (!data) return;
  const rows = [
    ["Metric", "Value"],
    ["Total Sales", data.totalSales],
    ["Total Orders", data.totalOrders],
    ["Average Order Value", data.averageOrderValue],
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  if (linkRef.current) {
    linkRef.current.href = url;
    linkRef.current.download = "analytics.csv";
    linkRef.current.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

const AdminDashboardPage = () => {
  const [period, setPeriod] = useState("Weekly");
  const [date, setDate] = useState("2023-11-15");
  const [search, setSearch] = useState("");

  const {
    open: sidebarOpen,
    setOpen: setSidebarOpen,
    toggle,
  } = useAdminSidebarStore();

  const { data, isLoading, isError } = useAnalytics();

  const filteredProducts =
    data?.topProducts?.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const linkRef = useRef(null);

  if (isLoading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }
  if (isError || !data) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-7xl">
      <div className="w-full p-2 md:p-4">
        {/* Header */}
        <Card className="flex flex-col gap-4 px-6 py-4 mb-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center flex-1 min-w-0 gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="hidden p-2 lg:inline-flex"
              onClick={toggle}
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              Report
            </h1>
            <div className="relative w-32 ml-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => exportAnalyticsCSV(data, linkRef)}
            >
              <Download className="w-4 h-4" /> Export CSV
            </Button>
            <a ref={linkRef} style={{ display: "none" }} />
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-50">
              <Calendar className="w-4 h-4 text-gray-400" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-8 p-0 bg-transparent border-0 w-28"
              />
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Switch
                checked={sidebarOpen}
                onCheckedChange={setSidebarOpen}
                id="toggle-chart"
              />
              <Label htmlFor="toggle-chart" className="text-sm text-gray-700">
                Toggle Chart
              </Label>
            </div>
          </div>
        </Card>

        {/* Metrics */}
        <div className="grid grid-cols-1 gap-6 mb-8 transition-all duration-300 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Sales Amount"
            value={data.totalSales}
            icon={BarChart3}
            iconColor="text-blue-500"
            delta={1543.3}
            deltaPercentage={12.2}
            unit="USD"
          />
          <DashboardCard
            title="Total Product Sales"
            value={data.totalOrders}
            icon={Package}
            iconColor="text-indigo-500"
            delta={125}
            deltaPercentage={10}
            unit="Items"
          />
          <DashboardCard
            title="Average Order Value"
            value={data.averageOrderValue}
            icon={Users}
            iconColor="text-orange-500"
            delta={-5}
            deltaPercentage={-0.02}
            unit="USD"
          />
          <DashboardCard
            title="Net Profit"
            value={data.totalSales}
            icon={FileText}
            iconColor="text-green-500"
            delta={3792}
            deltaPercentage={0.3}
            unit="USD"
          />
        </div>

        {/* Graphs and Lists */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
          <Card className="p-4">
            <h2 className="mb-2 text-lg font-semibold">Sales Report</h2>
            <ReportGraph data={data.salesByDay} totalSales={data.totalSales} />
          </Card>
          <Card className="p-4">
            <h2 className="mb-2 text-lg font-semibold">Top Products</h2>
            <FavoriteProductList products={filteredProducts} />
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="p-4 overflow-x-auto">
          <h2 className="mb-2 text-lg font-semibold">Recent Orders</h2>
          <OrdersTable orders={data.recentOrders} />
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
