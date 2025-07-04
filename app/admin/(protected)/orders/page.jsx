"use client";

import { useOrders } from "@/hooks/use-orders";
import OrdersTable from "@/components/order/orders-table";
import AdminOrdersHeader from "@/components/order/orders-header";
import { useAdminSidebarStore } from "@/hooks/zustand/use-admin-sidebar-store";
import { useRef } from "react";

export default function AdminOrdersPage() {
  const { data, isLoading, isError } = useOrders();
  const linkRef = useRef(null);
  const toggleSidebar = useAdminSidebarStore((s) => s.toggle);

  if (isLoading) {
    return <div className="p-8 text-center">Loading orders...</div>;
  }
  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">Failed to load orders.</div>
    );
  }

  return (
    <div className="min-h-screen p-3">
      <div className="mx-auto space-y-3 sm:space-y-6">
        <AdminOrdersHeader
          toggleSidebar={toggleSidebar}
          data={data || []}
          linkRef={linkRef}
        />
        <OrdersTable orders={data || []} />
      </div>
    </div>
  );
}
