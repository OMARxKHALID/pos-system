"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Menu } from "lucide-react";
import { exportAnalyticsToCSV } from "@/utils/pos-utils";

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

          <h1 className="truncate text-base sm:text-lg md:text-xl font-semibold text-gray-900 max-w-[60vw] sm:max-w-none">
            Report
          </h1>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          <Button
            className="flex w-full items-center gap-2 sm:w-auto"
            onClick={() => exportAnalyticsToCSV(data, linkRef)}
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
          <a ref={linkRef} style={{ display: "none" }} />
          <div className="flex w-full items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 sm:w-auto sm:px-4">
            <Calendar className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className="truncate text-xs sm:text-sm font-medium text-gray-700 max-w-[40vw] sm:max-w-none">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
