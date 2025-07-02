"use client";

import { useOrders } from "@/hooks/use-orders";
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from "lucide-react";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function OrderStatusBadge({ status }) {
  let variant = "secondary";
  if (status === "completed") variant = "default";
  if (status === "cancelled") variant = "destructive";
  return (
    <Badge variant={variant}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function exportOrdersCSV(orders, linkRef) {
  if (!orders || orders.length === 0) return;
  const rows = [
    ["Order ID", "Date", "Status", "Total", "Items"],
    ...orders.map((order) => [
      order._id,
      new Date(order.createdAt).toLocaleString(),
      order.status,
      order.total,
      order.items
        .map((item) => `${item.menuItem?.name || "Unknown"} x${item.quantity}`)
        .join("; "),
    ]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  if (linkRef.current) {
    linkRef.current.href = url;
    linkRef.current.download = "orders.csv";
    linkRef.current.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export default function AdminOrdersPage() {
  const { data, isLoading, isError, refetch } = useOrders();
  const [updating, setUpdating] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const linkRef = useRef(null);

  async function handleStatusChange(orderId, status) {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders?id=${orderId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Order status updated!");
      refetch();
    } catch {
      toast.error("Failed to update order status");
    }
    setUpdating(null);
  }

  // Filtering and searching
  const filtered = (data || [])
    .filter((order) => (filterStatus ? order.status === filterStatus : true))
    .filter((order) =>
      search
        ? order.items.some((item) =>
            item.menuItem?.name?.toLowerCase().includes(search.toLowerCase())
          ) || order._id.includes(search)
        : true
    );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-5xl mx-auto py-8 px-2 sm:px-4">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">
        Admin Order Management
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <Select
          value={filterStatus}
          onValueChange={setFilterStatus}
          className="w-full sm:w-40"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        <Input
          placeholder="Search by product or order ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <Button
          variant="outline"
          className="gap-2 w-full sm:w-auto"
          onClick={() => exportOrdersCSV(filtered, linkRef)}
        >
          <Download className="w-4 h-4" /> Export Orders CSV
        </Button>
      </div>
      <a ref={linkRef} style={{ display: "none" }} />
      {isLoading ? (
        <div className="p-8 text-center">Loading orders...</div>
      ) : isError ? (
        <div className="p-8 text-center text-red-500">
          Failed to load orders.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginated.length === 0 && <div>No orders found.</div>}
          {paginated.map((order) => (
            <Card
              key={order._id}
              className="p-4 flex flex-col h-full justify-between"
            >
              <div className="flex flex-col gap-2 mb-2">
                <div className="flex flex-wrap justify-between items-center">
                  <div className="font-semibold">
                    Order #{order._id.slice(-6)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">Status: </span>
                  <OrderStatusBadge status={order.status} />
                  <Select
                    value={order.status}
                    onValueChange={(status) =>
                      handleStatusChange(order._id, status)
                    }
                    disabled={updating === order._id}
                    className="w-32"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <span className="font-medium">Total: </span>${order.total}
                </div>
                <div>
                  <span className="font-medium">Items:</span>
                  <ul className="ml-4 list-disc">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.menuItem?.name || "Unknown"} x {item.quantity} ($
                        {item.price})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-2 text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrder(order)}
                >
                  Detail
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(i + 1)}
              className="w-8 h-8 p-0"
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
      {/* Order Detail Dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-2">
              <div>
                <span className="font-medium">Order ID:</span>{" "}
                {selectedOrder._id}
              </div>
              <div>
                <span className="font-medium">Date:</span>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                <OrderStatusBadge status={selectedOrder.status} />
              </div>
              <div>
                <span className="font-medium">Total:</span> $
                {selectedOrder.total}
              </div>
              <div>
                <span className="font-medium">Items:</span>
                <ul className="ml-4 list-disc">
                  {selectedOrder.items.map((item, idx) => (
                    <li key={idx}>
                      {item.menuItem?.name || "Unknown"} x {item.quantity} ($
                      {item.price})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
