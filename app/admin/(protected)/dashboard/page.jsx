"use client";

import { useState } from "react";
import {
  BarChart3,
  Package,
  Users,
  FileText,
  Calendar,
  Download,
  Search,
  Menu,
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

// Import refactored dashboard components
import DashboardCard from "@/components/dashboard/DashboardCard";
import ProductRow from "@/components/dashboard/ProductRow";
import StatusIndicator from "@/components/dashboard/StatusIndicator";
import ReportGraph from "@/components/dashboard/ReportGraph";
import FavoriteProductList from "@/components/dashboard/FavoriteProductList";
import OrdersTable from "@/components/dashboard/OrdersTable";

const AdminDashboardPage = () => {
  const [period, setPeriod] = useState("Weekly");
  const [date, setDate] = useState("2023-11-15");
  const [search, setSearch] = useState("");
  const [timeFrom, setTimeFrom] = useState("09:00");
  const [timeTo, setTimeTo] = useState("17:00");

  const {
    open: sidebarOpen,
    setOpen: setSidebarOpen,
    toggle,
  } = useAdminSidebarStore();

  const data = {
    totalSales: 15433,
    totalOrders: 1250,
    salesByDay: [
      { date: "Mon", sales: 4000 },
      { date: "Tue", sales: 3000 },
      { date: "Wed", sales: 5000 },
      { date: "Thu", sales: 2780 },
      { date: "Fri", sales: 1890 },
      { date: "Sat", sales: 2390 },
      { date: "Sun", sales: 3490 },
    ],
    topProducts: [
      { name: "Latte", category: "Coffee", quantity: 342 },
      { name: "Cappuccino", category: "Coffee", quantity: 256 },
      { name: "Espresso", category: "Coffee", quantity: 198 },
      { name: "Croissant", category: "Bakery", quantity: 175 },
      { name: "Sandwich", category: "Food", quantity: 132 },
    ],
  };

  const filteredProducts = data.topProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="col-span-full">
      <div className="w-full p-4 md:p-6">
        {/* Header */}
        <Card className="flex flex-col gap-4 px-6 py-4 mb-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center flex-1 gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="hidden p-2 lg:inline-flex"
              onClick={toggle}
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Report</h1>
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
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Download
            </Button>
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
        <div
          className={`grid gap-6 mb-8 transition-all duration-300 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`}
        >
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
            title="Total Customers"
            value={400}
            icon={Users}
            iconColor="text-orange-500"
            delta={-5}
            deltaPercentage={-0.02}
            unit="Persons"
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

        {/* Graph and Favorite Products */}
        <div className="grid gap-6 mb-8 transition-all duration-300 md:grid-cols-2">
          {/* Report Graph */}
          <div className="col-span-1 transition-all duration-300">
            {sidebarOpen && (
              <ReportGraph
                data={data.salesByDay}
                totalSales={data.totalSales}
              />
            )}
          </div>

          {/* Favorite Product List */}
          <div className="col-span-1 transition-all duration-300">
            <FavoriteProductList
              products={filteredProducts}
              search={search}
              setSearch={setSearch}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="transition-all duration-300">
          <OrdersTable
            date={date}
            setDate={setDate}
            timeFrom={timeFrom}
            setTimeFrom={setTimeFrom}
            timeTo={timeTo}
            setTimeTo={setTimeTo}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
