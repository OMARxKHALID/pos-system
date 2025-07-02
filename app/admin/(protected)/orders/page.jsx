"use client";

import { useOrders } from "@/hooks/use-orders";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function OrderStatusSelect({ value, onChange, disabled }) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      {statusOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
}

export default function AdminOrdersPage() {
  const { data, isLoading, isError, refetch } = useOrders();
  const [updating, setUpdating] = useState(null);

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

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Order Management</h1>
      {isLoading ? (
        <div>Loading orders...</div>
      ) : isError ? (
        <div className="text-red-500">Failed to load orders.</div>
      ) : (
        <div className="space-y-4">
          {data && data.length === 0 && <div>No orders yet.</div>}
          {data &&
            data.map((order) => (
              <Card key={order._id} className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold">
                    Order #{order._id.slice(-6)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="font-medium">Status: </span>
                  <OrderStatusSelect
                    value={order.status}
                    onChange={(status) => handleStatusChange(order._id, status)}
                    disabled={updating === order._id}
                  />
                </div>
                <div className="mb-2">
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
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
