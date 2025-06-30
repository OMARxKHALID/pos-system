"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Filter, Download } from "lucide-react";
import {
  billingQueueData,
  tablesData,
  orderHistoryData,
  trackOrderData,
} from "@/lib/activity-data";
import { PageLayout } from "@/components/ui/page-layout";
import { ActivitySidebar } from "@/components/activity/activity-sidebar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { usePOSStore } from "@/hooks/use-pos-store";

const ActivityPage = () => {
  const [activeView, setActiveView] = useState("billing-queue");
  const [activeTab, setActiveTab] = useState("all");
  const [activeFloor, setActiveFloor] = useState("1st Floor");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("May 25, 2024");
  const [dateTo, setDateTo] = useState("May 29, 2024");
  const [timeFrom, setTimeFrom] = useState("08:00");
  const [timeTo, setTimeTo] = useState("01:00");

  const { orderHistory } = usePOSStore();

  const getViewTitle = () => {
    switch (activeView) {
      case "billing-queue":
        return "Billing Queue";
      case "tables":
        return "Tables";
      case "order-history":
        return "Order History";
      default:
        return "Billing Queue";
    }
  };

  const getTableStatusColor = (status) => {
    switch (status) {
      case "served":
        return "bg-blue-500 text-white shadow-lg";
      case "reserved":
        return "bg-red-500 text-white shadow-lg";
      case "available":
        return "bg-slate-100 text-slate-600 border-2 border-slate-200";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const filteredBillingQueue = billingQueueData.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return item.status === "active";
    if (activeTab === "closed") return item.status === "closed";
    return true;
  });

  const activeQueueCount = billingQueueData.filter(
    (item) => item.status === "active"
  ).length;

  return (
    <PageLayout
      title="Activity"
      subtitle={getViewTitle()}
      headerActions={
        activeView === "order-history" && (
          <Button className="text-white bg-blue-500">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        )
      }
    >
      <div className="flex gap-6">
        <ActivitySidebar activeView={activeView} onViewChange={setActiveView} />

        <div className="flex-1">
          <Card className="border bg-white/80 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-6">
              {/* Search and Filters */}
              <div className="flex items-center justify-between mb-6">
                <div className="relative w-80">
                  <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                  <Input
                    placeholder="Search customers, orders, tables..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 pl-10 bg-slate-50 border-slate-200 rounded-xl"
                  />
                </div>

                {/* View-specific controls */}
                {activeView === "billing-queue" && (
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      {["all", "active", "closed"].map((tab) => (
                        <Button
                          key={tab}
                          variant={activeTab === tab ? "default" : "outline"}
                          size="sm"
                          className={`h-9 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                            activeTab === tab
                              ? "bg-blue-500 text-white"
                              : "border-slate-200 text-slate-600"
                          }`}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Button>
                      ))}
                    </div>
                    <Badge className="px-3 py-1 text-sm font-bold text-blue-600 bg-blue-100 rounded-full">
                      {activeQueueCount} Active
                    </Badge>
                  </div>
                )}

                {activeView === "tables" && (
                  <div className="flex items-center gap-4">
                    <Button className="px-4 text-white bg-blue-500 h-9 rounded-xl">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Table
                    </Button>
                    <div className="flex gap-2">
                      {["1st Floor", "2nd Floor", "3rd Floor"].map((floor) => (
                        <Button
                          key={floor}
                          variant={
                            activeFloor === floor ? "default" : "outline"
                          }
                          size="sm"
                          className={`h-9 px-4 rounded-xl text-sm transition-all duration-200 ${
                            activeFloor === floor
                              ? "bg-blue-500 text-white"
                              : "border-slate-200 text-slate-600"
                          }`}
                          onClick={() => setActiveFloor(floor)}
                        >
                          {floor}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {activeView === "order-history" && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-600">
                        Date
                      </span>
                      <Input
                        type="text"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="text-sm w-36 h-9 border-slate-200 rounded-xl"
                      />
                      <span className="text-slate-400">–</span>
                      <Input
                        type="text"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="text-sm w-36 h-9 border-slate-200 rounded-xl"
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
                )}
              </div>

              {/* Content based on active view */}
              {activeView === "billing-queue" && (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 text-center">#</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Order Number</TableHead>
                        <TableHead>Table</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBillingQueue.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-center">
                            {item.id}
                          </TableCell>
                          <TableCell>{item.customerName}</TableCell>
                          <TableCell>{item.orderNumber}</TableCell>
                          <TableCell>{item.table}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>{item.time}</TableCell>
                          <TableCell className="text-right">
                            ${item.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`text-xs font-medium rounded-xl px-3 py-1 ${
                                item.status === "active"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {item.status === "active" ? "Active" : "Closed"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {activeView === "tables" && (
                <div className="space-y-8">
                  {Object.entries(tablesData["1st Floor"]).map(
                    ([category, tables]) => (
                      <div key={category}>
                        <h3 className="mb-6 text-xl font-bold text-slate-800">
                          {category}
                        </h3>
                        <div className="grid grid-cols-6 gap-4">
                          {tables.map((table) => (
                            <Card
                              key={table.id}
                              className={`${getTableStatusColor(
                                table.status
                              )} transition-all hover:scale-105 rounded-2xl border-0 cursor-pointer`}
                            >
                              <CardContent className="p-6 text-center">
                                <h4 className="mb-3 text-xl font-bold">
                                  {table.id}
                                </h4>
                                {table.customer ? (
                                  <>
                                    <p className="mb-1 text-sm font-semibold">
                                      {table.customer}
                                    </p>
                                    <p className="mb-1 text-xs opacity-75">
                                      {table.guests} Guests
                                    </p>
                                    <p className="text-xs opacity-75">
                                      {table.time}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="mb-1 text-sm opacity-75">
                                      Available
                                    </p>
                                    <p className="text-xs opacity-75">
                                      Ready for guests
                                    </p>
                                  </>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  )}

                  {/* Enhanced Table Status Legend */}
                  <div className="flex items-center justify-center gap-8 pt-6 border-t border-slate-200">
                    <span className="text-sm font-semibold text-slate-700">
                      Table Status:
                    </span>
                    {[
                      {
                        status: "Available",
                        color: "bg-slate-100",
                        textColor: "text-slate-600",
                      },
                      {
                        status: "Served",
                        color: "bg-blue-500",
                        textColor: "text-white",
                      },
                      {
                        status: "Reserved",
                        color: "bg-red-500",
                        textColor: "text-white",
                      },
                    ].map(({ status, color, textColor }) => (
                      <div key={status} className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 ${color} rounded-full shadow-sm`}
                        ></div>
                        <span className="text-sm font-medium text-slate-600">
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeView === "order-history" && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">#</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Order Status</TableHead>
                      <TableHead>Total Payment</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Orders</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderHistory.map((row, idx) => (
                      <TableRow key={row.id + row.time}>
                        <TableCell className="text-center">{row.id}</TableCell>
                        <TableCell>
                          {row.date} - {row.time}
                        </TableCell>
                        <TableCell>{row.customerName}</TableCell>
                        <TableCell>{row.orderStatus}</TableCell>
                        <TableCell>
                          ${row.totalPayment?.toFixed(2) ?? "0.00"}
                        </TableCell>
                        <TableCell>{row.paymentStatus}</TableCell>
                        <TableCell>
                          {row.items
                            ? row.items
                                .map((item) => `${item.quantity}x ${item.name}`)
                                .join(", ")
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Track Order Section */}
          {activeView === "billing-queue" && (
            <Card className="mt-6 border bg-white/80 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800">
                    Live Order Tracking
                  </h3>
                  <Badge className="px-3 py-1 text-sm font-bold text-green-600 bg-green-100 rounded-full">
                    {trackOrderData.length} Active Orders
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  {trackOrderData.map((order, index) => (
                    <Card
                      key={index}
                      className="transition-all duration-200 border bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-200/50 rounded-2xl"
                    >
                      <CardContent className="p-6">
                        <div className="mb-4 text-center">
                          <Avatar className="mx-auto mb-3 w-14 h-14">
                            <AvatarFallback className="text-lg font-bold text-blue-600 bg-blue-100">
                              {order.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <h4 className="text-lg font-bold text-slate-800">
                            {order.name}
                          </h4>
                          <p className="mb-1 text-sm text-slate-500">
                            {order.table} • {order.type}
                          </p>
                          <p className="text-sm text-slate-500">{order.time}</p>
                        </div>

                        <div className="mb-4 space-y-2">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <p
                              key={idx}
                              className="px-2 py-1 text-xs rounded-lg text-slate-600 bg-white/50"
                            >
                              {idx + 1}× {item}
                            </p>
                          ))}
                          {order.items.length > 3 && (
                            <Button
                              variant="link"
                              className="h-auto p-0 text-xs font-medium text-blue-600"
                            >
                              +{order.items.length - 3} more items
                            </Button>
                          )}
                        </div>

                        <div className="text-center">
                          <Badge
                            className={`mb-3 text-sm font-medium rounded-xl px-3 py-1 ${order.statusColor}`}
                          >
                            {order.status}
                          </Badge>
                          <p className="text-xs font-medium text-slate-500">
                            Total: {order.totalItems} Items
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ActivityPage;
