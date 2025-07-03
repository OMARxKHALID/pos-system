"use client";

import { useState, useRef } from "react";
import { BarChart3, Package, FileText } from "lucide-react";
import { useAdminSidebarStore } from "@/hooks/use-pos-settings-store";
import { useAnalytics } from "@/hooks/use-report";
import DashboardCard from "@/components/dashboard/dashboard-card";
import ReportGraph from "@/components/dashboard/report-graph";
import FavoriteProducts from "@/components/dashboard/favorite-products";
import DashboardHeader from "@/components/dashboard/dashboard-header";

const AdminDashboardPage = () => {
  const [productSearch, setProductSearch] = useState("");
  const linkRef = useRef(null);
  const { data, isLoading, isError } = useAnalytics();
  const toggleSidebar = useAdminSidebarStore((s) => s.toggle);

  if (isLoading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  if (isError || !data) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load dashboard data.
      </div>
    );
  }

  const filteredTopProducts = (data.topProducts || []).filter(
    (p) =>
      !productSearch ||
      p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

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
