"use client";

import { useEffect, useRef, useState } from "react";
import { useDashboard } from "@/hooks/use-dashboard";
import { useAdminSidebarStore } from "@/hooks/zustand/use-admin-sidebar-store";
import HydrateDashboard from "@/components/hydration/hydrate-dashboard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();
  const { toggle } = useAdminSidebarStore();
  const linkRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <HydrateDashboard />;
  }

  if (isLoading) {
    return <DashboardSkeleton />;
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

  return (
    <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      <DashboardHeader toggleSidebar={toggle} linkRef={linkRef} />

      <DashboardStats data={data} />

      <DashboardCharts data={data} />
    </div>
  );
}
