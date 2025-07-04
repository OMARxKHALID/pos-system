"use client";

import OrdersTable from "@/components/order/orders-table";
import { useAdminSidebarStore } from "@/hooks/zustand/use-admin-sidebar-store";
import { useSalesStore } from "@/hooks/zustand/use-sales-store";
import { useHydrateOrders } from "@/hooks/hydration/use-hydrate-orders";
import { useRef } from "react";
import {
  ClipboardList,
  ChevronRight,
  Home,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";

export default function AdminOrdersPage() {
  const orders = useSalesStore((s) => s.orders);
  const { isHydrated, isLoading } = useHydrateOrders();
  const linkRef = useRef(null);
  const toggleSidebar = useAdminSidebarStore((s) => s.toggle);

  if (isLoading || !isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4 text-gray-600 text-base sm:text-lg font-medium">
            Loading orders...
          </div>
        </div>
      </div>
    );
  }

  // Calculate order statistics
  const totalOrders = orders?.length || 0;
  const completedOrders =
    orders?.filter((order) => order.status === "completed")?.length || 0;
  const pendingOrders =
    orders?.filter((order) => order.status === "pending")?.length || 0;
  const totalRevenue =
    orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="mx-auto max-w-7xl p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Enhanced Header */}
        <div className="mb-6 sm:mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            <Home className="w-3 h-3 sm:w-4 sm:h-4" />
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Admin</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-gray-900 font-medium">Orders</span>
          </nav>

          {/* Main Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-orange-100 rounded-lg sm:rounded-xl">
                  <ClipboardList className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Order Management
                  </h1>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                    Track and manage all restaurant orders
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-700 text-xs sm:text-sm px-2 sm:px-3 py-1"
              >
                <ClipboardList className="w-3 h-3 mr-1.5 sm:mr-2" />
                {totalOrders} Orders
              </Badge>
              <button
                ref={linkRef}
                onClick={toggleSidebar}
                className="p-2 sm:p-3 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm border border-gray-200"
              >
                <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Total Orders
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                    {totalOrders}
                  </p>
                </div>
                <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-blue-100 rounded-lg">
                  <ClipboardList className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Completed
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                    {completedOrders}
                  </p>
                </div>
                <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Pending
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                    {pendingOrders}
                  </p>
                </div>
                <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Total Revenue
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                    {formatCurrency(totalRevenue)}
                  </p>
                </div>
                <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-purple-100 rounded-lg">
                  <ClipboardList className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <OrdersTable orders={orders || []} />
      </div>
    </div>
  );
}
