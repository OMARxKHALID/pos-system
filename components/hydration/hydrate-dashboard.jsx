"use client";

import { useEffect, useState } from "react";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export default function HydrateDashboard({ children }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <DashboardSkeleton />;
  }

  return children;
}
