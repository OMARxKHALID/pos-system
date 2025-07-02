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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
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
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";

const AdminDashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [period, setPeriod] = useState("Weekly");
  const [date, setDate] = useState("2023-11-15");
  const [search, setSearch] = useState("");
  const [timeFrom, setTimeFrom] = useState("09:00");
  const [timeTo, setTimeTo] = useState("17:00");

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

  const DashboardCard = ({
    title,
    value,
    icon: Icon,
    iconColor,
    delta,
    deltaPercentage,
    unit,
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Icon className={`w-5 h-5 ${iconColor}`} /> {title}
        </div>
        <span className="text-xs text-gray-400">{unit}</span>
      </CardHeader>
      <CardContent>
        <div className="mb-1 text-3xl font-bold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div className="flex items-center gap-2 text-xs">
          {delta && (
            <span
              className={`${
                delta > 0 ? "text-green-600" : "text-red-500"
              } font-semibold`}
            >
              {delta > 0 ? "+" : ""}
              {delta}
            </span>
          )}
          {deltaPercentage && (
            <span
              className={`${
                deltaPercentage > 0 ? "text-green-600" : "text-red-500"
              } font-semibold`}
            >
              {deltaPercentage > 0 ? "+" : ""}
              {deltaPercentage}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ProductRow = ({ product }) => (
    <TableRow>
      <TableCell>
        <div className="flex items-center justify-center w-10 h-10 text-lg font-bold bg-gray-100 rounded-lg">
          {product.name.charAt(0)}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm font-medium text-gray-900">{product.name}</div>
        <div className="text-xs text-gray-400">
          {product.category || "Product"}
        </div>
      </TableCell>
      <TableCell className="text-sm font-semibold text-right text-gray-700">
        {product.quantity}x
      </TableCell>
    </TableRow>
  );

  const StatusIndicator = ({ status }) => (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === "open"
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {status === "open" ? "Completed" : "In Progress"}
    </span>
  );

  return (
    <div className="w-full min-h-screen p-0 bg-white">
      {/* Header */}
      <Card className="flex flex-col gap-4 px-6 py-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center flex-1 gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden mr-2 lg:inline-flex"
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
          <div className="flex items-center gap-2">
            <Switch
              checked={sidebarOpen}
              onCheckedChange={setSidebarOpen}
              id="toggle-sidebar"
            />
            <Label htmlFor="toggle-sidebar" className="text-sm text-gray-700">
              Toggle Sidebar
            </Label>
          </div>
        </div>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-6 px-2 mb-8 md:grid-cols-4">
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
      <div className="grid grid-cols-1 gap-6 px-2 mb-8 md:grid-cols-3">
        {/* Report Graph */}
        {sidebarOpen && (
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">
                Report Graph
              </CardTitle>
              <CardDescription>Total Sales Amount</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-56 p-2 bg-gradient-to-b from-blue-50/60 to-white rounded-xl">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.salesByDay}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#6366f1"
                      name="Sales"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-6 mt-6">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Amount</span>
                  <span className="text-lg font-bold text-gray-900">
                    {data.totalSales.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Growth</span>
                  <span className="text-lg font-bold text-green-600">
                    +1,543.30
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Growth %</span>
                  <span className="text-lg font-bold text-blue-600">12.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Favorite Product List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">
              Favorite Product
            </CardTitle>
            <div className="flex items-center gap-2">
              <Input
                className="w-32 h-8 p-2 text-sm"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Img</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="text-right">Total Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.slice(0, 5).map((product) => (
                  <ProductRow key={product.name} product={product} />
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-8 text-center text-gray-400"
                    >
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="mx-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">All Orders</CardTitle>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-50">
              <Calendar className="w-4 h-4 text-gray-400" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-8 p-0 bg-transparent border-0 w-28"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-50">
              <span className="text-xs text-gray-400">Time:</span>
              <Input
                type="time"
                value={timeFrom}
                onChange={(e) => setTimeFrom(e.target.value)}
                className="w-16 h-8 p-0 bg-transparent border-0"
              />
              <span className="text-xs text-gray-400">-</span>
              <Input
                type="time"
                value={timeTo}
                onChange={(e) => setTimeTo(e.target.value)}
                className="w-16 h-8 p-0 bg-transparent border-0"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Total Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>001</TableCell>
                <TableCell>2024-05-25 09:00 AM</TableCell>
                <TableCell>George</TableCell>
                <TableCell>
                  <StatusIndicator status="open" />
                </TableCell>
                <TableCell>$25.00</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>002</TableCell>
                <TableCell>2024-05-25 08:45 AM</TableCell>
                <TableCell>Anna</TableCell>
                <TableCell>
                  <StatusIndicator status="busy" />
                </TableCell>
                <TableCell>$18.00</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
