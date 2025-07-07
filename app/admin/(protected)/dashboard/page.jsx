"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "@/hooks/use-dashboard";
import { useAdminSidebarStore } from "@/hooks/zustand/use-admin-sidebar-store";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { PageLoading } from "@/components/ui/loading";
import { PermissionGuard } from "@/components/common/permission-guard";

export default function DashboardPage() {
  const { data, isLoading, error, refetch, isRefetching } = useDashboard();
  console.log("🚀 ~ DashboardPage ~ data:", data);
  const [isClient, setIsClient] = useState(false);
  const toggleSidebar = useAdminSidebarStore((s) => s.toggle);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRefresh = () => {
    refetch();
  };

  if (!isClient) {
    return <PageLoading />;
  }
  if (isLoading) {
    return <PageLoading />;
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Error loading dashboard data
          </div>
          <div className="text-gray-600">
            Please try refreshing the page or contact support if the problem
            persists.
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <div className="text-gray-600 text-lg font-semibold mb-2">
            No data available
          </div>
          <div className="text-gray-500">
            Dashboard data will appear here once you have orders and sales data.
          </div>
        </div>
      </div>
    );
  }

  // Map API data to expected prop names for dashboard components
  const statsData = {
    totalSales: data.totalRevenue,
    revenueChange: data.revenueChange,
    totalOrders: data.totalOrders,
    ordersChange: data.ordersChange,
    totalCustomers: data.totalCustomers,
    customersChange: data.customersChange,
    totalProducts: data.totalProducts,
    productsChange: data.productsChange,
  };

  // Map dailyRevenue to the format expected by ReportGraph (sales instead of revenue)
  const revenueData = Array.isArray(data.dailyRevenue)
    ? data.dailyRevenue.map((d) => ({ date: d.date, sales: d.revenue }))
    : [];

  const chartsData = {
    revenueData,
    todaySales: data.dailyRevenue?.[6]?.revenue || 0,
    yesterdaySales: data.dailyRevenue?.[5]?.revenue || 0,
    topProducts: data.topSellingItems,
  };

  return (
    <PermissionGuard requiredPermission="dashboard">
      <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
        <DashboardHeader
          toggleSidebar={toggleSidebar}
          onRefresh={handleRefresh}
          isRefreshing={isRefetching}
        />

        <DashboardStats data={statsData} />

        <DashboardCharts data={chartsData} />
      </div>
    </PermissionGuard>
  );
}
