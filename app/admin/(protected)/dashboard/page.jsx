"use client";

import { useState, useRef } from "react";
import {
  BarChart3,
  Package,
  FileText,
  Tag,
  ChevronRight,
  Home,
  TrendingUp,
} from "lucide-react";
import { useAdminSidebarStore } from "@/hooks/zustand/use-admin-sidebar-store";
import { useAnalytics } from "@/hooks/use-report";
import DashboardCard from "@/components/dashboard/dashboard-card";
import ReportGraph from "@/components/dashboard/report-graph";
import FavoriteProducts from "@/components/dashboard/favorite-products";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";

// Dashboard skeleton component
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
    <div className="mx-auto max-w-7xl p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header Skeleton */}
      <div className="mb-6 sm:mb-8">
        <div className="space-y-2">
          <Skeleton className="h-6 sm:h-8 w-32 sm:w-48" />
          <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
        </div>
      </div>

      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 mb-2" />
                  <Skeleton className="h-6 sm:h-8 w-20 sm:w-24" />
                </div>
                <Skeleton className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Lists Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 xl:grid-cols-2">
        {/* Chart Skeleton */}
        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 mb-4" />
            <Skeleton className="h-[250px] sm:h-[300px] lg:h-[350px] w-full" />
          </CardContent>
        </Card>

        {/* Products List Skeleton */}
        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                    <Skeleton className="h-2 sm:h-3 w-12 sm:w-16" />
                  </div>
                  <Skeleton className="h-3 sm:h-4 w-8 sm:w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4 text-red-500 text-base sm:text-lg font-medium">
            Failed to load dashboard data.
          </div>
          {error && (
            <div className="text-xs sm:text-sm text-gray-600">
              Error: {error.message || "Unknown error"}
            </div>
          )}
        </div>
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

  // Calculate today's and yesterday's sales from salesByDay data
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0]; // YYYY-MM-DD format

  const todaySales =
    data.salesByDay?.find((day) => day.date === today)?.sales || 0;
  const yesterdaySales =
    data.salesByDay?.find((day) => day.date === yesterday)?.sales || 0;

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
            <span className="text-gray-900 font-medium">Dashboard</span>
          </nav>

          {/* Main Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl">
                  <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                    Overview of your restaurant performance and analytics
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 text-xs sm:text-sm px-2 sm:px-3 py-1"
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2"></div>
                Live Data
              </Badge>
              <button
                ref={linkRef}
                onClick={toggleSidebar}
                className="p-2 sm:p-3 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm border border-gray-200"
              >
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Total Sales
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                    {formatCurrency(data.totalSales)}
                  </p>
                </div>
                <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Total Orders
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                    {data.totalOrders}
                  </p>
                </div>
                <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-green-100 rounded-lg">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Avg Order Value
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                    {formatCurrency(data.averageOrderValue)}
                  </p>
                </div>
                <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-purple-100 rounded-lg">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Top Category
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                    {formatCurrency(topCategorySales)}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {topCategoryName}
                  </p>
                </div>
                <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-orange-100 rounded-lg">
                  <Tag className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Lists */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 xl:grid-cols-2">
          <ReportGraph
            data={data.salesByDay}
            totalSales={data.totalSales}
            todaySales={todaySales}
            yesterdaySales={yesterdaySales}
          />

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
