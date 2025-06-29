"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Search,
  Filter,
} from "lucide-react";
import { reportMetrics, allOrders } from "@/lib/report-data";
import { ReportChart } from "@/components/report/report-chart";
import { FavoriteProducts } from "@/components/report/favorite-products";
import { PageLayout } from "@/components/ui/page-layout";
import { MetricCard } from "@/components/ui/metric-card";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

const ReportPage = () => {
  const [showGraph, setShowGraph] = useState(true);
  const [dateFrom, setDateFrom] = useState("May 25, 2024");
  const [dateTo, setDateTo] = useState("May 29, 2024");
  const [timeFrom, setTimeFrom] = useState("08:00");
  const [timeTo, setTimeTo] = useState("01:00");

  const orderColumns = [
    { key: "id", label: "#", align: "center" },
    {
      key: "dateTime",
      label: "Date & Time",
      render: (_, row) => `${row.date} - ${row.time}`,
    },
    { key: "customerName", label: "Customer Name" },
    { key: "orderStatus", label: "Order Status" },
    { key: "totalPayment", label: "Total Payment" },
    { key: "paymentStatus", label: "Payment Status" },
    { key: "orders", label: "Orders" },
  ];

  return (
    <PageLayout
      title="Report"
      headerActions={
        <Button className="text-white bg-blue-500">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      }
    >
      {/* Controls */}
      <Card className="border bg-white/80 backdrop-blur-sm border-slate-200/60">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700">
                  Report Period
                </span>
                <Select defaultValue="monthly">
                  <SelectTrigger className="w-40 h-10 text-sm border-slate-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">
                Show Analytics
              </span>
              <Switch checked={showGraph} onCheckedChange={setShowGraph} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Sales"
          value={reportMetrics.totalSales.current}
          unit="USD"
          change={reportMetrics.totalSales.change}
          percentage={reportMetrics.totalSales.percentage}
          trend={reportMetrics.totalSales.trend}
          icon={TrendingUp}
        />
        <MetricCard
          title="Products Sold"
          value={reportMetrics.totalProducts.current}
          unit="Items"
          change={reportMetrics.totalProducts.change}
          percentage={reportMetrics.totalProducts.percentage}
          trend={reportMetrics.totalProducts.trend}
          icon={Package}
        />
        <MetricCard
          title="Total Customers"
          value={reportMetrics.totalCustomers.current}
          unit="Persons"
          change={reportMetrics.totalCustomers.change}
          percentage={reportMetrics.totalCustomers.percentage}
          trend={reportMetrics.totalCustomers.trend}
          icon={Users}
        />
        <MetricCard
          title="Net Profit"
          value={reportMetrics.netProfit.current}
          unit="USD"
          change={reportMetrics.netProfit.change}
          percentage={reportMetrics.netProfit.percentage}
          trend={reportMetrics.netProfit.trend}
          icon={DollarSign}
        />
      </div>

      {/* Charts and Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {showGraph && (
          <div className="lg:col-span-2">
            <ReportChart />
          </div>
        )}
        <div className={showGraph ? "lg:col-span-1" : "lg:col-span-3"}>
          <FavoriteProducts />
        </div>
      </div>

      {/* Orders Table */}
      <Card className="border bg-white/80 backdrop-blur-sm border-slate-200/60">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Order History</h3>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600">
                  Date Range
                </span>
                <Input
                  type="text"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="text-sm w-36 h-9 border-slate-200 rounded-xl"
                />
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">–</span>
                <Input
                  type="text"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="text-sm w-36 h-9 border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600">Time</span>
                <Input
                  type="time"
                  value={timeFrom}
                  onChange={(e) => setTimeFrom(e.target.value)}
                  className="text-sm w-28 h-9 border-slate-200 rounded-xl"
                />
                <span className="text-slate-400">–</span>
                <Input
                  type="time"
                  value={timeTo}
                  onChange={(e) => setTimeTo(e.target.value)}
                  className="text-sm w-28 h-9 border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl"
                >
                  <Search className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl"
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Table rendering */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">#</TableHead>
                <TableHead>Date &amp; Time</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Total Payment</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Orders</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allOrders.map((row, idx) => (
                <TableRow key={row.id + row.date + row.time}>
                  <TableCell className="text-center">{row.id}</TableCell>
                  <TableCell>{`${row.date} - ${row.time}`}</TableCell>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.orderStatus}</TableCell>
                  <TableCell>{row.totalPayment}</TableCell>
                  <TableCell>{row.paymentStatus}</TableCell>
                  <TableCell>
                    {row.orders
                      ? Array.isArray(row.orders)
                        ? row.orders.join(", ")
                        : row.orders
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default ReportPage;
