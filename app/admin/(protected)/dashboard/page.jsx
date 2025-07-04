"use client";

import { useState, useRef } from "react";
import { BarChart3, Package, FileText, Tag } from "lucide-react";
import { useAdminSidebarStore } from "@/hooks/zustand/use-admin-sidebar-store";
import { useAnalytics } from "@/hooks/use-report";
import DashboardCard from "@/components/dashboard/dashboard-card";
import ReportGraph from "@/components/dashboard/report-graph";
import FavoriteProducts from "@/components/dashboard/favorite-products";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";

// Dashboard skeleton component
const DashboardSkeleton = () => (
  <div className="min-h-screen p-3">
    <div className="mx-auto space-y-3 sm:space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 lg:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl sm:p-5 lg:p-6"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 rounded" />
                <Skeleton className="h-4 w-20 sm:w-24" />
              </div>
              <Skeleton className="h-3 w-8" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Skeleton className="h-8 w-24 sm:h-10 lg:h-12" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Lists Skeleton */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 sm:gap-6">
        {/* Chart Skeleton */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl p-4 sm:p-5 lg:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="w-2 h-2 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-[250px] sm:h-[280px] lg:h-[320px] xl:h-[350px] w-full" />
        </div>

        {/* Products List Skeleton */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const [productSearch, setProductSearch] = useState("");
  const linkRef = useRef(null);
  const { data, isLoading, isError, error } = useAnalytics();
  const toggleSidebar = useAdminSidebarStore((s) => s.toggle);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    console.error("Dashboard error:", error);
    return (
      <div className="p-8 text-center text-red-500">
        <div className="mb-4">Failed to load dashboard data.</div>
        {error && (
          <div className="text-sm text-gray-600">
            Error: {error.message || "Unknown error"}
          </div>
        )}
      </div>
    );
  }

  const filteredTopProducts = (data.topProducts || []).filter(
    (p) =>
      !productSearch ||
      p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Get top category data from salesByCategory data
  const topCategory = data.salesByCategory?.[0];
  const topCategoryName = topCategory?.category || "N/A";
  const topCategorySales = topCategory?.sales || 0;

  return (
    <div className="min-h-screen p-3">
      <div className="mx-auto space-y-3 sm:space-y-6">
        {/* Header */}
        <DashboardHeader
          data={data}
          linkRef={linkRef}
          toggleSidebar={toggleSidebar}
        />

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 lg:gap-6">
          <DashboardCard
            title="Total Sales Amount"
            value={data.totalSales}
            icon={BarChart3}
            iconColor="text-gray-600"
            unit="USD"
          />
          <DashboardCard
            title="Total Orders"
            value={data.totalOrders}
            icon={Package}
            iconColor="text-gray-600"
            unit="Orders"
          />
          <DashboardCard
            title="Average Order Value"
            value={data.averageOrderValue}
            icon={FileText}
            iconColor="text-gray-600"
            unit="USD"
          />
          <DashboardCard
            title="Top Category Sales"
            value={topCategorySales}
            icon={Tag}
            iconColor="text-gray-600"
            unit="USD"
            subtitle={topCategoryName}
          />
        </div>

        {/* Charts and Lists */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 sm:gap-6">
          <ReportGraph data={data.salesByDay} totalSales={data.totalSales} />
          <FavoriteProducts
            products={filteredTopProducts}
            search={productSearch}
            setSearch={setProductSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
