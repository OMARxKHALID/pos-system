"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Menu, Download } from "lucide-react";
import { exportAnalyticsToCSV } from "@/utils/analytics";

export default function DashboardHeader({ data, linkRef, toggleSidebar }) {
  return (
    <Card className="border border-gray-200 bg-white shadow-sm sm:rounded-xl">
      <CardHeader className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 p-2 hover:bg-gray-100 sm:p-2"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </Button>
          <BarChart3 className="h-7 w-7 text-gray-600" />
          <h1 className="truncate text-xl sm:text-2xl font-semibold text-gray-900 max-w-[60vw] sm:max-w-none">
            Report
          </h1>
        </div>
        <div className="flex items-center gap-4 justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => exportAnalyticsToCSV(data, linkRef)}
            aria-label="Download report"
          >
            <Download className="h-5 w-5 text-gray-600" />
          </Button>
          <a ref={linkRef} style={{ display: "none" }} />
          <span className="truncate text-xs sm:text-sm font-medium text-gray-700 max-w-[40vw] sm:max-w-none">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </CardHeader>
    </Card>
  );
}
