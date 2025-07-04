"use client";

import OrdersTable from "@/components/order/orders-table";
import AdminOrdersHeader from "@/components/order/orders-header";
import { useAdminSidebarStore } from "@/hooks/zustand/use-admin-sidebar-store";
import { useSalesStore } from "@/hooks/zustand/use-sales-store";
import { useHydrateOrders } from "@/hooks/hydration/use-hydrate-orders";
import { useRef } from "react";

export default function AdminOrdersPage() {
  const orders = useSalesStore((s) => s.orders);
  const { isHydrated, isLoading } = useHydrateOrders();
  const linkRef = useRef(null);
  const toggleSidebar = useAdminSidebarStore((s) => s.toggle);

  if (isLoading || !isHydrated) {
    return <div className="p-8 text-center">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen p-3">
      <div className="mx-auto space-y-3 sm:space-y-6">
        <AdminOrdersHeader
          toggleSidebar={toggleSidebar}
          data={orders || []}
          linkRef={linkRef}
        />
        <OrdersTable orders={orders || []} />
      </div>
    </div>
  );
}
